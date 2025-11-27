// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library DIDGenerator {
    function randomUint128() internal view returns (uint128) {
        return uint128(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))));
    }

    function generateUuidv4Uint128() internal view returns (uint128) {
        uint128 rand = randomUint128();

        // Modify bits according to UUID v4 standard
        // Version (7th byte high 4 bits) = 4
        rand = (rand & 0xFFFFFFFFFFFF0FFF_FFFFFFFFFFFFFFFF) | 0x0000000000004000_0000000000000000;

        // Variant (9th byte high 2 bits) = 8
        rand = (rand & 0xFFFFFFFFFFFFFFFF_3FFFFFFFFFFFFFFF) | 0x0000000000000000_8000000000000000;

        return rand;
    }
}
