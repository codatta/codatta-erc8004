import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import { defineChain } from 'viem';

// KiteAI Testnet 自定义链配置
// 参考: https://rpc-testnet.gokite.ai
export const kiteAITestnet = defineChain({
  id: 2368,
  name: 'KiteAI Testnet',
  nativeCurrency: {
    name: 'KiteAI',
    symbol: 'KITE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.gokite.ai'],
    },
    public: {
      http: ['https://rpc-testnet.gokite.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'KiteAI Explorer',
      url: 'https://explorer-testnet.gokite.ai',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Codatta Tool',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [kiteAITestnet, mainnet, polygon, optimism, arbitrum, base, sepolia], // kiteAITestnet as default
  ssr: true,
});

