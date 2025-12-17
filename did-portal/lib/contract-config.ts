// 合约配置文件
// 在这里配置你的合约地址和网络信息

import { parseAbi } from 'viem';

// Identity Registry (ERC-8004)
export const CONTRACT_ADDRESS = '0x740aA385eF5D72ee6BCedF38FFFa5990F21fbBc5';
export const CONTRACT_CHAIN_ID = 2368; // KiteAI Testnet Chain ID

export const CONTRACT_ABI = parseAbi([
  'function register() external returns (uint256 agentId)',
  'function setAgentUri(uint256 agentId, string calldata newUri) external',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'event Registered(uint256 indexed agentId, string tokenURI, address indexed owner)',
]);

// Reputation Registry
export const REPUTATION_CONTRACT_ADDRESS = '0x1cb3dE12d2bb014f3eb411E68CEb44A4293fba17'; // 请替换为实际地址
export const REPUTATION_ABI = parseAbi([
  'function giveFeedback(uint256 agentId, uint8 score, bytes32 tag1, bytes32 tag2, string calldata feedbackUri, bytes32 feedbackHash, bytes calldata feedbackAuth) external',
  'function getScore(uint256 agentId) external view returns (uint256)',
  'event NewFeedback(uint256 indexed agentId, address indexed clientAddress, uint8 score, bytes32 indexed tag1, bytes32 tag2, string feedbackUri, bytes32 feedbackHash)',
]);

// 为了保持向后兼容，也导出 REGISTER_ABI
export const REGISTER_ABI = CONTRACT_ABI;

