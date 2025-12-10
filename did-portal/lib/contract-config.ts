// 合约配置文件
// 在这里配置你的合约地址和网络信息

import { parseAbi } from 'viem';

export const CONTRACT_ADDRESS = '0x740aA385eF5D72ee6BCedF38FFFa5990F21fbBc5'; // 请替换为你的实际合约地址
export const CONTRACT_CHAIN_ID = 2368; // KiteAI Testnet Chain ID

// 方案1: 使用 parseAbi (推荐，更简洁且不易出错)
export const CONTRACT_ABI = parseAbi([
  'function register() external returns (uint256 agentId)',
  'function setAgentUri(uint256 agentId, string calldata newUri) external',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'event Registered(uint256 indexed agentId, string tokenURI, address indexed owner)',
]);

// 方案2: 完整的 JSON ABI (如果方案1有问题，取消注释使用这个)
// export const CONTRACT_ABI = [
//   {
//     type: 'function',
//     name: 'register',
//     stateMutability: 'nonpayable',
//     inputs: [],
//     outputs: [{ name: 'agentId', type: 'uint256', internalType: 'uint256' }],
//   },
//   {
//     type: 'function',
//     name: 'setAgentUri',
//     stateMutability: 'nonpayable',
//     inputs: [
//       { name: 'agentId', type: 'uint256', internalType: 'uint256' },
//       { name: 'newUri', type: 'string', internalType: 'string' }
//     ],
//     outputs: [],
//   },
//   {
//     type: 'function',
//     name: 'tokenURI',
//     stateMutability: 'view',
//     inputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
//     outputs: [{ name: '', type: 'string', internalType: 'string' }],
//   },
// ] as const;

// 为了保持向后兼容，也导出 REGISTER_ABI
export const REGISTER_ABI = CONTRACT_ABI;

