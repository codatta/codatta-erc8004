# DID Portal

A Next.js web portal for interacting with the DID ecosystem.

## 📖 User Guide

**For end users**, see the complete user guide: [USAGE.md](./USAGE.md)

This README is for developers. If you're looking for instructions on how to use the DID Portal, please refer to the usage guide above.

---

## For Developers

A Next.js web portal for interacting with the DID ecosystem. Provides three core functionalities:

1. **JSON File Upload** - Upload JSON files and send them to backend
2. **EVM Wallet Connection** - Connect to EVM wallets and interact with smart contracts
3. **DID Document Viewer** - Read and display DID document data from third-party services

## Features

### 🔄 JSON File Upload
- Drag and drop JSON files or click to select
- Automatic DID extraction from JSON `id` field
- DID format validation (must be `did:codatta:<UUID-v4>`)
- Preview JSON content before uploading
- Send data to backend API for processing
- Real-time upload status feedback

### 💼 Wallet Integration
- Connect to multiple EVM chains (Ethereum, Polygon, Optimism, Arbitrum, Base, Sepolia, KiteAI Testnet)
- Support for popular wallets via RainbowKit
- Read and write smart contract functions
- Transaction status tracking

### 🔍 DID Document Viewer
- Fetch DID documents from resolver services
- Syntax-highlighted JSON display
- Copy to clipboard functionality
- Load example DID documents

## Service Dependencies

This portal works with backend services:

1. **updater/** - Service for uploading DID documents to storage
2. **resolver/** - Service for resolving DID documents from storage

```
User → DID Portal → Updater → Storage
                  → Resolver → Storage
                  → Contracts (Blockchain)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend services configured (updater and resolver)

### Installation

1. Navigate to the project directory:

```bash
cd did-portal
```

2. Install dependencies:

```bash
npm install
```

### Configuration

#### 1. Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Port (optional, default: 3000)
PORT=3000

# WalletConnect Project ID (required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Backend Service URLs
NEXT_PUBLIC_RESOLVER_URL=http://localhost:3002
NEXT_PUBLIC_UPDATER_URL=http://localhost:3001
```

#### 2. WalletConnect Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`

#### 3. Contract Configuration

Update the contract address in `lib/contract-config.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYourContractAddressHere';
export const CONTRACT_CHAIN_ID = 2368; // Your network chain ID
```

The project includes pre-configured support for KiteAI Testnet (Chain ID: 2368). You can modify network settings in `lib/wagmi.ts`.

## Development

### Running

See the main [README](../README.md) for instructions on starting all services.

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

- **Wallet connection issues**: Check WalletConnect Project ID and network settings
- **Upload failures**: Ensure backend services (updater) are running
- **Query failures**: Ensure resolver service is running and accessible

## License

MIT

