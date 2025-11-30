# ERC-8004 × Codatta: Reconstruction
A repository implementing the Reconstruction of Codatta DID using ‘ERC-8004’.

## Structure

- contracts: Solidity contracts implementing Codatta DID in the form of 'ERC-8004', including identity registry, reputation registry, validation registry.
- updater: A tool used to interact with the system, including user registration and the management of user information.

## Functions
1. Register the agent/DID (via the command-line tool)
2. Modify the DID document
3. Retrieve the document through the browser (the resolver hasn’t been developed yet, so it’s fetched directly from S3)
