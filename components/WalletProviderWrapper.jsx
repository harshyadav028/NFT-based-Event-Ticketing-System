// WalletProviderWrapper.jsx
"use client";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const wallets = [new PetraWallet()];

export default function WalletProviderWrapper({ children }) {
  return (
    <AptosWalletAdapterProvider wallets={wallets}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
