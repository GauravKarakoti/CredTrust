"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, TrustTokenABI, CredTrustRegistryABI, getContract } from "../../utils/contracts";
import { cn } from "../../lib/utils.ts";

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

  const handleStake = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError("");

    try {
      // FIX: Add a guard clause to ensure window.ethereum exists
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      // FIX: Use the `as any` type assertion
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get contracts
      const trustToken = getContract(
        CONTRACT_ADDRESSES.trustToken,
        TrustTokenABI,
        signer
      );

      const registry = getContract(
        CONTRACT_ADDRESSES.credTrustRegistry,
        CredTrustRegistryABI,
        signer
      );

      // Approve tokens first
      const amountWei = ethers.parseUnits(amount.toString(), 18);
      const approveTx = await trustToken.approve(CONTRACT_ADDRESSES.credTrustRegistry, amountWei);
      await approveTx.wait();

      // Stake tokens
      const stakeTx = await registry.stakeForUser(address, amountWei);
      await stakeTx.wait();

      onStake(amount);
      onClose();
    } catch (err: any) {
      console.error("Staking failed:", err);
      setError(err.message || "Staking failed");
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
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-sm">
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