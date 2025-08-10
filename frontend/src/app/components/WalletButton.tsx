"use client";

import { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useAccount, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, TrustTokenABI, getContract } from "../../utils/contracts";

export default function WalletButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const fetchBalance = async () => {
      // Add a check for window.ethereum to satisfy TypeScript
      if (isConnected && address && window.ethereum) {
        // Use `as any` to assert the type and prevent conflicts
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const trustToken = getContract(
          CONTRACT_ADDRESSES.trustToken,
          TrustTokenABI,
          provider
        );
        const bal = await trustToken.balanceOf(address);
        setBalance(ethers.formatUnits(bal, 18));
      }
    };

    fetchBalance();
    // Add a dependency on `balance` to refetch if it changes, e.g., after a swap
  }, [address, isConnected, balance]);

  const truncateAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="flex items-center gap-4">
      {isConnected && (
        <div className="bg-zinc-800 rounded-full px-4 py-2 text-sm font-mono">
          {parseFloat(balance).toFixed(2)} TRUST
        </div>
      )}
      <button
        className="rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 hover:bg-white transition-colors"
        onClick={() => isConnected ? disconnect() : open()}
      >
        {isConnected ? `Connected: ${truncateAddress(address || "")}` : "Connect Wallet"}
      </button>
    </div>
  );
}