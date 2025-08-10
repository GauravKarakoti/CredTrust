"use client";

import { useState } from "react";
import StakeModal from "./StakeModal";
import { cn } from "../../lib/utils"

export default function AttestationsCard() {
  const [attestations, setAttestations] = useState([
    "Staked 500 TRUST to vouch for CID Qm...abc",
  ]);
  
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleStake = (amount: number) => {
    setAttestations([
      ...attestations,
      `Staked ${amount} TRUST to vouch for CID Qm...${Math.random().toString(36).substring(2, 8)}`
    ]);
  };

  const handleUnstake = () => {
    if (attestations.length === 0) return;
    
    setIsUnstaking(true);
    setTimeout(() => {
      const newAttestations = [...attestations];
      newAttestations.pop();
      setAttestations(newAttestations);
      setIsUnstaking(false);
    }, 1500);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <StakeModal 
        isOpen={isStakeModalOpen} 
        onClose={() => setIsStakeModalOpen(false)}
        onStake={handleStake}
      />
      
      <h3 className="text-lg font-medium">Attestations</h3>
      
      <ul className="mt-3 space-y-2 text-sm text-zinc-300">
        {attestations.length > 0 ? (
          attestations.map((att, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-500 mr-2">•</span>
              {att}
            </li>
          ))
        ) : (
          <li className="text-zinc-500">No active attestations</li>
        )}
        
        <li className={attestations.length > 0 ? "text-emerald-500" : "text-rose-500"}>
          {attestations.length > 0 
            ? "No disputes open" 
            : "Stake TRUST to create attestations"}
        </li>
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
            attestations.length === 0 && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleUnstake}
          disabled={attestations.length === 0 || isUnstaking}
        >
          {isUnstaking ? "Processing..." : "Unstake"}
        </button>
      </div>
    </div>
  );
}