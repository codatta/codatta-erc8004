# ERC-8004 × Codatta: Reconstruction
A repository implementing the Reconstruction of Codatta DID using `ERC-8004`.

## Structure

- contracts: - contracts: Solidity contracts implementing Codatta DID in the form of `ERC-8004`, including identity registry, reputation registry, validation registry.
- updater: A service for uploading did documents onto storage service, including S3, decentralized storage.
- tool: Frontend for interacting with the did system.

## Functions
1. Register the agent/DID (via the command-line tool)
2. Modify the DID document
3. Retrieve the document through the browser (the resolver hasn’t been developed yet, so it’s fetched directly from S3)

## Usage

Open [Codatta DID Tooken](http://localhost:3000)

### Register

- Click `Register Agent`

![alt text](./assets/register.png)

- Confirm transaction in popup window

![alt text](./assets/confirm.png)

- Wait for transaction receipt

![alt text](./assets/receipt.png)

`1` is the agent id stored in contracts

`2` is the did related to agent id

### Update DID Document

- Prepare DID Document

You can refer to the [DID Document file](./assets/did.json), remember to change the `id` with your did.

- Upload DID Document

![alt text](./assets/upload.png)

Till now, you have completed creating a ERC8004-version Codatta DID. Next, you can repeat [Update DID Document](#Update-DID-Document) to update the DID Document, or follow the tutorial bellow to query the DID Document of a did.

## Query DID Document

- updater: A tool used to interact with the system, including user registration and the management of user information.