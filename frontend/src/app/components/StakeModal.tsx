"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useEthersSigner } from "../../hooks/useEthersSigner"; // You should use the hook for consistency
import { CONTRACT_ADDRESSES, TrustTokenABI, CredTrustRegistryABI, getContract } from "../../utils/contracts";
import { cn } from "../../lib/utils";

export default function StakeModal({
  isOpen,
  onClose,
  onStake
}: {
  isOpen: boolean;
  onClose: () => void;
  onStake: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // FIX: Get the signer from the wagmi/Web3Modal hook
  const signer = useEthersSigner();

  const handleStake = async () => {
    // Check for the signer from the hook, not window.ethereum
    if (!signer) {
      setError("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const address = await signer.getAddress();

      // Get contracts connected to the SIGNER, which enables write transactions
      const trustToken = getContract(
        CONTRACT_ADDRESSES.trustToken,
        TrustTokenABI,
        signer // Use the signer here
      );

      const registry = getContract(
        CONTRACT_ADDRESSES.credTrustRegistry,
        CredTrustRegistryABI,
        signer // And here
      );

      // Now this call will work because `trustToken` is connected to a signer
      const amountWei = ethers.parseUnits(amount.toString(), 18);
      const approveTx = await trustToken.approve(CONTRACT_ADDRESSES.credTrustRegistry, amountWei);
      await approveTx.wait();

      const stakeTx = await registry.stakeForUser(address, amountWei);
      await stakeTx.wait();

      onStake(amount);
      onClose();
    } catch (err: any) {
      console.error("Staking failed:", err);
      // More user-friendly error parsing
      const reason = err.reason || "An unknown error occurred during staking.";
      setError(reason);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800">
        <h3 className="text-xl font-medium mb-4">Stake TRUST</h3>

        <div className="mb-4">
          <label className="block text-sm mb-2">Amount to stake</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-zinc-400 mt-1">
            <span>50 TRUST</span>
            <span className="text-emerald-500 font-medium">{amount} TRUST</span>
            <span>1000 TRUST</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-900/30 text-rose-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="flex-1 rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-emerald-950",
              loading ? "bg-emerald-800" : "bg-emerald-500 hover:bg-emerald-400"
            )}
            onClick={handleStake}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Stake"}
          </button>
        </div>
      </div>
    </div>
  );
}