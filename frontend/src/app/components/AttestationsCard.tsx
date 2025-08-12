"use client";

import { useState, useEffect, useCallback } from "react";
import StakeModal from "./StakeModal";
import { cn } from "../../lib/utils";
import { ethers } from "ethers";
import { useEthersSigner } from "../../hooks/useEthersSigner";
import { 
  CONTRACT_ADDRESSES, 
  CredTrustRegistryABI, 
  getContract 
} from "../../utils/contracts";
import { type Attestation, type AttestationStruct } from "../../types";

export default function AttestationsCard() {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const signer = useEthersSigner();

  const fetchAttestationData = useCallback(async () => {
    if (!signer) {
      setLoading(false);
      setAttestations([]);
      setTotalStaked(BigInt(0));
      return;
    }
    
    setLoading(true);
    try {
      const address = await signer.getAddress();
      const registry = getContract(
        CONTRACT_ADDRESSES.credTrustRegistry,
        CredTrustRegistryABI,
        signer
      );
      
      const onChainAttestations: AttestationStruct[] = await registry.getAttestations(address);
      
      const formattedAttestations = onChainAttestations.map((att: AttestationStruct) => ({
        attester: att[0],
        amount: ethers.formatUnits(att[1], 18),
        timestamp: new Date(Number(att[2]) * 1000).toLocaleString(),
      }));

      const stakedAmount = await registry.getStakedAmount(address);
      setTotalStaked(stakedAmount);
      setAttestations(formattedAttestations);

    } catch (error: unknown) { // Use unknown for errors
      console.error("Error fetching attestations:", error);
    } finally {
      setLoading(false);
    }
  }, [signer]);

  useEffect(() => {
    fetchAttestationData();
  }, [fetchAttestationData]);

  // Real unstake function that sends a transaction
  const handleUnstake = async () => {
    if (!signer || totalStaked === BigInt(0)) return;

    setLoading(true);
    try {
      const registry = getContract(
        CONTRACT_ADDRESSES.credTrustRegistry,
        CredTrustRegistryABI,
        signer
      );

      // Unstake the entire amount
      const tx = await registry.unstake(totalStaked);
      await tx.wait();
      
      alert("Unstake successful!");
      await fetchAttestationData(); // Refresh the data
    } catch (error: unknown) { // Use unknown for errors
      console.error("Unstaking failed:", error);
      if (error instanceof Error) {
        alert(`Unstaking failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <StakeModal 
        isOpen={isStakeModalOpen} 
        onClose={() => setIsStakeModalOpen(false)}
        onStake={() => fetchAttestationData()}
      />
      
      <h3 className="text-lg font-medium">Your Attestations</h3>
      <p className="text-sm text-zinc-400">
        Total Staked: {parseFloat(ethers.formatUnits(totalStaked, 18)).toFixed(2)} TRUST
      </p>
      
      <ul className="mt-3 space-y-2 text-sm text-zinc-300 h-24 overflow-y-auto">
        {loading ? (
          <li className="text-zinc-500">Loading...</li>
        ) : attestations.length > 0 ? (
          attestations.map((att, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              <span>
                Attester {att.attester.substring(0, 6)}... staked {parseFloat(att.amount).toFixed(2)} TRUST on {att.timestamp}
              </span>
            </li>
          ))
        ) : (
          <li className="text-zinc-500">No active attestations for you.</li>
        )}
      </ul>
      
      <div className="mt-4 flex gap-2">
        <button 
          className="rounded-md bg-emerald-500 px-3 py-2 text-emerald-950 hover:bg-emerald-400"
          onClick={() => setIsStakeModalOpen(true)}
        >
          Stake TRUST
        </button>
        
        <button 
          className={cn(
            "rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-800",
            totalStaked === BigInt(0) && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleUnstake}
          disabled={totalStaked === BigInt(0) || loading}
        >
          {loading ? "Processing..." : "Unstake All"}
        </button>
      </div>
    </div>
  );
}