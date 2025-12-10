# ERC-8004 × Codatta: Reconstruction

Reconstruction of Codatta DID using ERC-8004 standard, enabling secure agent registration, document management, and identity verification.

## 🚀 Try it Now

**Live Demo**: [Coming Soon]  
**Local Setup**: See [Quick Start](#quick-start-recommended) below

## 📖 User Guide

**New to DID Portal?** Check out the complete user guide: [did-portal/USAGE.md](./did-portal/USAGE.md)

---

## ✨ Features

- 🔐 **Blockchain-based Identity** - Secure agent registration on ERC-8004 smart contracts
- 📄 **Document Management** - Upload and store DID documents with automatic validation
- 🔍 **Identity Resolution** - Fast and reliable DID document querying
- 💼 **Wallet Integration** - Support for MetaMask and major EVM wallets
- ⚡ **Real-time Updates** - Instant feedback on transactions and operations
- 🌐 **Multi-chain Support** - Compatible with various EVM networks

## 📦 Project Structure

| Directory | Description |
|-----------|-------------|
| **contracts/** | Solidity smart contracts (ERC-8004 implementation) |
| **updater/** | Backend service for uploading DID documents to storage |
| **resolver/** | Backend service for resolving DID documents from storage |
| **did-portal/** | Web portal (Next.js frontend) |

## Setup

### Prerequisites
- Node.js 18+
- Storage backend configured (see Configuration section)
- EVM-compatible wallet (MetaMask, etc.)

### Step 1: Configuration

#### 1.1 Deploy Smart Contracts (optional if using existing deployment)

For contract deployment instructions, see [contracts/README.md](./contracts/README.md).

#### 1.2 Configure Contract Settings

After deployment, update the contract configuration in DID Portal:
- **File**: `did-portal/lib/contract-config.ts`
  - Update `CONTRACT_ADDRESS` with your deployed contract address
  - Update `CONTRACT_CHAIN_ID` with your target network ID
- **File**: `did-portal/lib/wagmi.ts`
  - Configure supported networks and RPC endpoints

#### 1.3 Configure AWS S3

Set up S3 credentials for both updater and resolver services:

```bash
# Updater service
cp updater/config/default.example.json updater/config/default.json
# Edit updater/config/default.json with your AWS credentials

# Resolver service
cp resolver/config/default.example.json resolver/config/default.json
# Edit resolver/config/default.json with your AWS credentials
```

#### 1.4 Configure Service Ports (Optional)

All services use configurable ports:
- **Updater**: Edit `updater/config/default.json` → `server.port`
- **Resolver**: Edit `resolver/config/default.json` → `server.port`
- **DID Portal**: Set `PORT` environment variable

### Step 2: Launch Services

#### Quick Start (Recommended)

Start all services with one command:
```bash
./start-services.sh
```

Verify all services are running:
```bash
./test-services.sh
```

To stop all services:
```bash
./stop-services.sh
```

#### Manual Start (Alternative)

If you prefer to start services individually:

```bash
# Start updater service
cd updater
npm install
npm run dev

# Start resolver service
cd resolver
npm install
npm run dev

# Start DID Portal
cd did-portal
npm install
npm run dev
```

## Usage

After starting all services, open the DID Portal in your browser.

For detailed usage instructions with screenshots and step-by-step guides, see:
📖 **[User Guide](./did-portal/USAGE.md)**

### Quick Overview

1. **Register Agent** - Create a new DID identity on the blockchain
2. **Upload DID Document** - Store your identity information
3. **Query DID Document** - Retrieve and verify DID information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [User Guide](./did-portal/USAGE.md)
- **ERC-8004 Standard**: https://eips.ethereum.org/EIPS/eip-8004
- **DID Specification**: https://www.w3.org/TR/did-core/

---

**Built with** ❤️ **using ERC-8004**