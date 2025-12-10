## Usage

### Prerequisites

node >= v22

### Installation

```
npm install
```

### Configuration

Copy `config/default.example.json` to `config/default.json`

Modify configurations:
- **s3.region**: AWS region
- **s3.accessKeyId**: AWS access key ID
- **s3.secretAccessKey**: AWS secret access key
- **did.s3.bucket**: S3 bucket name
- **did.s3.root**: Root directory in S3
- **did.localDir**: Local directory for temporary storage
- **server.port**: Port number (default: 3001)

### Run

```
npx ts-node src/server.ts
```