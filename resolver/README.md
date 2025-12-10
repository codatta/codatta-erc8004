# DID Resolver Service

A service for resolving DID (Decentralized Identifier) documents from storage.

## Features

- 🔍 Resolve DID documents by DID identifier
- ☁️ Fetch DID documents from configured storage backend
- 🚀 RESTful API interface

## Installation

```bash
npm install
```

## Configuration

1. Copy the example configuration file:
```bash
cp config/default.example.json config/default.json
```

2. Edit `config/default.json` with your AWS credentials and settings:
```json
{
  "s3": {
    "region": "us-west-2",
    "accessKeyId": "your-access-key-id",
    "secretAccessKey": "your-secret-access-key"
  },
  "did": {
    "s3": {
      "bucket": "your-bucket-name",
      "root": "did"
    }
  },
  "server": {
    "port": 3002
  }
}
```

### Configuration Parameters

- **s3.region**: AWS region where your S3 bucket is located
- **s3.accessKeyId**: Your AWS access key ID
- **s3.secretAccessKey**: Your AWS secret access key
- **did.s3.bucket**: S3 bucket name where DID documents are stored
- **did.s3.root**: Root directory path in S3 bucket (e.g., "did")
- **server.port**: Port number for the resolver service (default: 3002, configurable)

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

Build and run:
```bash
npm run build
npm start
```

## API Endpoints

### Resolve DID Document

**GET** `/resolve/:did`

Resolves and retrieves a DID document from storage.

**Parameters:**
- `did` (path parameter): The DID identifier (e.g., "did:example:123")

**Example Request:**
```bash
curl http://localhost:3002/resolve/did:example:123
```

**Success Response (200):**
```json
{
  "success": true,
  "didDocument": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:example:123",
    "verificationMethod": [...],
    ...
  }
}
```

**Error Response (404):**
```json
{
  "error": "DID document not found",
  "did": "did:example:123"
}
```

### Health Check

**GET** `/health`

Check if the service is running.

**Example Request:**
```bash
curl http://localhost:3002/health
```

**Response (200):**
```json
{
  "status": "ok",
  "service": "did-resolver",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

## How It Works

1. Client sends a GET request with a DID identifier
2. Resolver constructs the storage key: `<root>/<did>.json`
3. Service fetches the document from storage
4. Document is parsed and returned to the client

## File Storage Format

DID documents are stored with the following structure:

```
s3://<bucket>/<root>/<did>.json
```

Example:
```
s3://my-bucket/did/did:example:123.json
```

## Error Handling

- **400 Bad Request**: Missing or invalid DID parameter
- **404 Not Found**: DID document doesn't exist in storage
- **500 Internal Server Error**: Storage access error or parsing error

## Integration with Other Services

This resolver service is part of a DID ecosystem:

- **contracts/**: Smart contracts for DID registration (8004)
- **updater/**: Service for uploading DID documents to storage
- **did-portal/**: User interface for DID interactions
- **resolver/**: This service - resolves DID documents from storage

## Development

### Project Structure

```
resolver/
├── src/
│   ├── server.ts      # Express server and API endpoints
│   ├── resolver.ts    # Core DID resolution logic
│   └── s3.ts          # Storage client wrapper
├── config/
│   ├── default.example.json
│   └── default.json   # Your local config (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

### TypeScript Build

The project uses TypeScript with the following configuration:
- Target: ES2016
- Module: CommonJS
- Strict mode enabled
- Output directory: `dist/`

## License

MIT

