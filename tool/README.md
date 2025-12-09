# Codatta Tool

A Next.js application with three core functionalities:

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

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd /Users/georgehuang/Program/codatta/tool
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:

```env
# Get your project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# DID Service API URL (default: Universal Resolver)
NEXT_PUBLIC_DID_SERVICE_URL=https://dev.uniresolver.io/1.0/identifiers

# Backend API URL for JSON uploads
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3000/api/upload
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### WalletConnect Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env.local` file

### Contract Configuration

The contract interaction feature is configured to call the `register` function. To update the contract address:

1. Open `lib/contract-config.ts`
2. Replace the `CONTRACT_ADDRESS` with your actual contract address:

```typescript
export const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

The contract ABI is already configured for the `register(string memory tokenUri)` function. If you need to modify the function signature, edit the `REGISTER_ABI` in the same file.

### KiteAI Testnet Configuration

The project includes support for KiteAI Testnet with the following configuration:

- **Network Name**: KiteAI Testnet
- **Chain ID**: 2368
- **RPC URL**: https://rpc-testnet.gokite.ai
- **Currency Symbol**: KITE
- **Block Explorer**: https://explorer-testnet.gokite.ai

You can connect to KiteAI Testnet directly through the wallet connection interface. The network is already configured in `lib/wagmi.ts`.

### DID Resolver Configuration

By default, the app uses the Universal DID Resolver. To use a custom resolver:

1. Update `NEXT_PUBLIC_DID_SERVICE_URL` in your `.env.local`
2. Modify the API call in `components/DidDocumentViewer.tsx` if needed

### Backend API Customization

The JSON upload feature uses a Next.js API route by default. Documents are uploaded via:
- **Method**: PUT
- **Path**: `/api/document/:id`
- **ID Parameter**: DID string (must be `did:codatta:<UUID-v4>`)
- **Body**: JSON document data

**DID Format Requirements:**
- Must start with `did:codatta:`
- Followed by a valid UUID v4
- Example: `did:codatta:12345678-abcd-4def-9012-3456789abcde`
- UUID v4 format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
  - Third group starts with `4` (version)
  - Fourth group starts with `8`, `9`, `a`, or `b` (variant)

**JSON File Requirements:**
Your JSON file must include an `id` field with a valid DID:
```json
{
  "id": "did:codatta:12345678-abcd-4def-9012-3456789abcde",
  "name": "Document Name",
  "data": { ... }
}
```

To use an external backend:

1. Create `.env.local` and set `NEXT_PUBLIC_BACKEND_API_URL`:
```bash
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend.com/api
```

2. Ensure your backend implements:
   - `PUT /document/:id` - Upload/update document
   - Accepts JSON body with valid DID in URL
   - Returns success/error response

## Project Structure

```
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # API endpoint for JSON uploads
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main page
│   └── providers.tsx             # Wagmi and RainbowKit providers
├── components/
│   ├── JsonUploader.tsx          # JSON file upload component
│   ├── ContractInteraction.tsx   # Wallet and contract component
│   └── DidDocumentViewer.tsx     # DID document viewer component
├── lib/
│   ├── wagmi.ts                  # Wagmi configuration
│   └── contract-config.ts        # Contract address and ABI configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi, viem, RainbowKit
- **HTTP Client**: Axios
- **File Upload**: react-dropzone
- **Syntax Highlighting**: Prism.js

## Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Customization Tips

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for custom theme colors
- Components use Tailwind utility classes for easy customization

### Adding New Features
- Add new pages in the `app/` directory
- Create new components in the `components/` directory
- Add API routes in `app/api/`

## Troubleshooting

### Wallet Connection Issues
- Ensure your WalletConnect Project ID is valid
- Check that you're on a supported network
- Try clearing browser cache/cookies

### DID Resolver Errors
- Verify the DID format is correct
- Check that the resolver service is accessible
- Some DIDs may not be registered yet

### Upload Failures
- Ensure the file is valid JSON
- Check backend API is running and accessible
- Verify CORS settings if using external backend

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

