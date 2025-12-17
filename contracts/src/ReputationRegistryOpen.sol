// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

interface IIdentityRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function getApproved(uint256 tokenId) external view returns (address);
}

/// @notice Open Reputation Registry - 允许无需授权的反馈
/// @dev 与原版相比，允许 feedbackAuth 为空，跳过签名验证
contract ReputationRegistryOpen {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address private immutable IDENTITY_REGISTRY;

    event NewFeedback(
        uint256 indexed agentId,
        address indexed clientAddress,
        uint8 score,
        bytes32 indexed tag1,
        bytes32 tag2,
        string feedbackUri,
        bytes32 feedbackHash
    );

    event FeedbackRevoked(
        uint256 indexed agentId,
        address indexed clientAddress,
        uint64 indexed feedbackIndex
    );

    event ResponseAppended(
        uint256 indexed agentId,
        address indexed clientAddress,
        uint64 feedbackIndex,
        address indexed responder,
        string responseUri,
        bytes32 responseHash
    );

    struct Feedback {
        uint8 score;
        bytes32 tag1;
        bytes32 tag2;
        bool isRevoked;
    }

    struct FeedbackAuth {
        uint256 agentId;
        address clientAddress;
        uint64 indexLimit;
        uint256 expiry;
        uint256 chainId;
        address identityRegistry;
        address signerAddress;
    }

    mapping(uint256 => mapping(address => mapping(uint64 => Feedback))) private _feedback;
    mapping(uint256 => mapping(address => uint64)) private _lastIndex;
    mapping(uint256 => mapping(address => mapping(uint64 => mapping(address => uint64)))) private _responseCount;
    mapping(uint256 => mapping(address => mapping(uint64 => address[]))) private _responders;
    mapping(uint256 => mapping(address => mapping(uint64 => mapping(address => bool)))) private _responderExists;
    mapping(uint256 => address[]) private _clients;
    mapping(uint256 => mapping(address => bool)) private _clientExists;
    mapping(uint256 => uint256) private _scores;

    constructor(address _identityRegistry) {
        require(_identityRegistry != address(0), "bad identity");
        IDENTITY_REGISTRY = _identityRegistry;
    }

    function getIdentityRegistry() external view returns (address) {
        return IDENTITY_REGISTRY;
    }

    function giveFeedback(
        uint256 agentId,
        uint8 score,
        bytes32 tag1,
        bytes32 tag2,
        string calldata feedbackUri,
        bytes32 feedbackHash,
        bytes calldata feedbackAuth
    ) external {
        require(score <= 100, "score>100");
        require(_agentExists(agentId), "Agent does not exist");

        IIdentityRegistry registry = IIdentityRegistry(IDENTITY_REGISTRY);
        address agentOwner = registry.ownerOf(agentId);

        require(
            msg.sender != agentOwner &&
            !registry.isApprovedForAll(agentOwner, msg.sender) &&
            registry.getApproved(agentId) != msg.sender,
            "Self-feedback not allowed"
        );

        // 🆕 如果 feedbackAuth 不为空，才进行验证
        if (feedbackAuth.length > 0) {
            _verifyFeedbackAuth(agentId, msg.sender, feedbackAuth);
        }
        // 否则跳过验证，允许任何人提交反馈

        uint64 currentIndex = _lastIndex[agentId][msg.sender] + 1;

        _feedback[agentId][msg.sender][currentIndex] = Feedback({
            score: score,
            tag1: tag1,
            tag2: tag2,
            isRevoked: false
        });

        _lastIndex[agentId][msg.sender] = currentIndex;

        if (!_clientExists[agentId][msg.sender]) {
            _clients[agentId].push(msg.sender);
            _clientExists[agentId][msg.sender] = true;
        }

        _scores[agentId] += score;

        emit NewFeedback(agentId, msg.sender, score, tag1, tag2, feedbackUri, feedbackHash);
    }

    function _agentExists(uint256 agentId) internal view returns (bool) {
        try IIdentityRegistry(IDENTITY_REGISTRY).ownerOf(agentId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }

    function _verifyFeedbackAuth(
        uint256 agentId,
        address clientAddress,
        bytes calldata feedbackAuth
    ) internal view {
        require(feedbackAuth.length >= 289, "Invalid auth length");

        FeedbackAuth memory auth;
        (
            auth.agentId,
            auth.clientAddress,
            auth.indexLimit,
            auth.expiry,
            auth.chainId,
            auth.identityRegistry,
            auth.signerAddress
        ) = abi.decode(feedbackAuth[:224], (uint256, address, uint64, uint256, uint256, address, address));

        require(auth.agentId == agentId, "AgentId mismatch");
        require(auth.clientAddress == clientAddress, "Client mismatch");
        require(block.timestamp < auth.expiry, "Auth expired");
        require(auth.chainId == block.chainid, "ChainId mismatch");
        require(auth.identityRegistry == IDENTITY_REGISTRY, "Registry mismatch");
        require(auth.indexLimit >= _lastIndex[agentId][clientAddress] + 1, "IndexLimit exceeded");

        _verifySignature(auth, feedbackAuth[224:]);
    }

    function _verifySignature(
        FeedbackAuth memory auth,
        bytes calldata signature
    ) internal view {
        bytes32 messageHash = keccak256(
            abi.encode(
                auth.agentId,
                auth.clientAddress,
                auth.indexLimit,
                auth.expiry,
                auth.chainId,
                auth.identityRegistry,
                auth.signerAddress
            )
        ).toEthSignedMessageHash();

        address recoveredSigner = messageHash.recover(signature);
        if (recoveredSigner != auth.signerAddress) {
            if (auth.signerAddress.code.length == 0) {
                revert("Invalid signature");
            }
            require(
                IERC1271(auth.signerAddress).isValidSignature(messageHash, signature) == IERC1271.isValidSignature.selector,
                "Bad 1271 signature"
            );
        }

        IIdentityRegistry registry = IIdentityRegistry(IDENTITY_REGISTRY);
        address owner = registry.ownerOf(auth.agentId);
        require(
            auth.signerAddress == owner ||
            registry.isApprovedForAll(owner, auth.signerAddress) ||
            registry.getApproved(auth.agentId) == auth.signerAddress,
            "Signer not authorized"
        );
    }

    function getScore(uint256 agentId) external view returns (uint256) {
        return _scores[agentId];
    }

    // ... 其他函数省略，与原合约相同
}

