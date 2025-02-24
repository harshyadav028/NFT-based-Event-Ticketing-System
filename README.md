# Blockchain-Based Event Ticketing System

This project leverages the Aptos blockchain to create a decentralized event ticketing system. By minting each ticket as a unique NFT and integrating a secondary marketplace with enforced price controls and royalties, this solution addresses ticket fraud, scalping, and opaque resale markets. The system ensures ticket authenticity and fair pricing while guaranteeing that event organizers receive a percentage of every resale.

I have majorly refered from aptos official documentation and aptos github libraries.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Initialize the Frontend Project](#2-initialize-the-frontend-project)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Setup the Aptos TS SDK](#4-setup-the-aptos-ts-sdk)
  - [5. Configure Environment Variables](#5-configure-environment-variables)
  - [6. Deploy Move Smart Contracts](#6-deploy-move-smart-contracts)
  - [7. Run the Application](#7-run-the-application)
- [Using the dApp](#using-the-dapp)
- [Project Structure](#project-structure)
- [References](#references)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Centralized ticketing platforms often suffer from issues like fraud, scalping, and lack of transparency. Our solution utilizes the Aptos blockchain and the Move programming language to mint each event ticket as an NFT. This ensures:

- **Authenticity**: No duplicate tickets.
- **Fair Pricing**: Secondary marketplace enforces price limits and royalties so that event organizers always benefit from resales.
- **Transparency**: All transactions and ownership transfers are verifiable on the blockchain.

The dApp is built as a web application that interacts with smart contracts deployed on the Aptos Devnet using the `@aptos-labs/ts-sdk`.

---

## Features

- **NFT-Based Ticketing**: Each event ticket is minted as a non-fungible token, preventing fraud and duplication.
- **Secondary Marketplace**: Enables ticket resales with enforced price controls and royalties for organizers.
- **Blockchain Integration**: Utilizes Aptos Devnet for smart contract deployment and transaction verification.
- **Petra Wallet Integration**: Users can connect their Petra wallets for secure interactions.
- **Robust Frontend**: Built with Next.js and integrated with the Aptos TS SDK for seamless user experience.

---

## Architecture

The project is divided into two main components:

### Smart Contracts (Move Language):
- Resides in the `contracts/` directory.
- Handles ticket minting, transfer, and resale logic.
- Enforces rules such as price ceilings and royalties on secondary sales.

### Frontend Application:
- Built using Next.js and located in the `frontend/` directory.
- Uses the `@aptos-labs/ts-sdk` for blockchain interactions.
- Integrates with Petra Wallet to enable users to manage their tickets.

---

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (or pnpm)
- **Git**
- **Petra Wallet** installed in your browser
- **Access to the Aptos Devnet** (for testing and deployment)
- (Optional) **Aptos CLI** for Move smart contract compilation and deployment

---

## Setup Instructions

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

---

### 2. Initialize the Frontend Project

If you haven’t already set up a Next.js project, you can initialize one using:

```bash
npx create-next-app@latest frontend
```

Follow the prompts to set up your new Next.js application.

---

### 3. Install Dependencies

Navigate to your frontend project directory and install the required packages:

```bash
cd frontend
npm install @aptos-labs/ts-sdk next react react-dom
```

You may also need to install other dependencies such as Tailwind CSS or environment variable packages if your frontend uses them.

---

### 4. Setup the Aptos TS SDK

Configure the Aptos TS SDK in your application to interact with the Aptos Devnet. For example, create a configuration file (e.g., `aptosConfig.ts`) with the following:

```typescript
import { AptosClient, FaucetClient } from '@aptos-labs/ts-sdk';

// Initialize the Aptos client for Devnet
export const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');

// Optional: Initialize the faucet client for funding test accounts
export const faucetClient = new FaucetClient(
  'https://fullnode.devnet.aptoslabs.com',
  'https://faucet.devnet.aptoslabs.com'
);
```

Refer to the [Aptos TS SDK Quickstart](https://aptos.dev/en/build/guides/build-e2e-dapp) for more detailed instructions on setting up accounts, using the faucet, and sending transactions.

---

Ensure you restart the Next.js server after adding environment variables.

---

### 6. Deploy Move Smart Contracts

Your smart contracts, written in Move, handle the core ticketing logic. Follow these steps to compile and deploy them:

#### Navigate to the contracts directory:

```bash
cd ../contracts
```

#### Compile the Smart Contracts:

Use the Aptos CLI to compile your Move package:

```bash
aptos move compile --package-dir .
```

#### Deploy to Devnet:

Publish your smart contracts to the Aptos Devnet:

```bash
aptos move publish --package-dir .
```

#### Verify Deployment:

Check the Aptos Devnet explorer to ensure your smart contracts are deployed successfully.

---

### 7. Run the Application

After setting up the frontend and deploying the smart contracts, start your Next.js development server:

```bash
cd ../frontend
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see your dApp in action.

---

## Using the dApp

- **Connect Your Wallet**: Open the dApp and connect your Petra Wallet.
- **Mint Tickets**: Use the interface to mint event tickets, each recorded as a unique NFT.
- **List Tickets**: Sell or transfer tickets on the secondary marketplace. The smart contracts enforce price controls and allocate royalties to event organizers.
- **View Transactions**: All transactions are recorded on the Aptos Devnet and can be verified via the blockchain explorer.

---

---

## References

- [Aptos Developer Portal](https://aptos.dev/)
- [Aptos TS SDK Quickstart Guide](https://aptos.dev/en/build/guides/build-e2e-dapp)
- [Petra Wallet](https://petra.app/)

---

## Contributing

Contributions are welcome! If you have ideas for improvements or want to add new features, please:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Open a pull request detailing your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Happy Building with Aptos! 🚀**

