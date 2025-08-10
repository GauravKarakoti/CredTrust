"use client";

import { useEffect, useState } from "react";
import ScoreChart from "./ScoreChart";
import { cn } from "../../lib/utils";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CredTrustRegistryABI, getContract } from "../../utils/contracts";

export default function ScoreCard() {
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [ipfsHash, setIpfsHash] = useState("");
  
  useEffect(() => {
    const fetchScore = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        const registry = getContract(
          CONTRACT_ADDRESSES.credTrustRegistry,
          CredTrustRegistryABI,
          signer
        );
        
        try {
          const userScore = await registry.getScore(address);
          setScore(Number(userScore));
          
          // In a real app, you would fetch IPFS hash here
          setIpfsHash(`QmXyZ${Math.random().toString(36).substring(2, 10)}`);
        } catch (error) {
          console.error("Error fetching score:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchScore();
  }, []);

  const scoreLevel = score >= 800 ? "Excellent" : 
                    score >= 700 ? "Good" : 
                    score >= 600 ? "Fair" : "Poor";

  const levelColor = {
    Excellent: "text-emerald-400",
    Good: "text-amber-400",
    Fair: "text-orange-500",
    Poor: "text-rose-500"
  };

  if (loading) {
    return (
      <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-medium">Your Score</h2>
        <div className="mt-4 h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 900 - score }
  ];

  return (
    <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-medium">Your Score</h2>
      
      <div className="mt-4 flex items-end gap-6">
        <div className="text-6xl font-bold">{score}</div>
        <div className="text-zinc-400">/ 900</div>
        <div className={cn("font-medium", levelColor[scoreLevel])}>
          {scoreLevel}
        </div>
      </div>
      
      <ScoreChart data={chartData} />
      
      <p className="mt-2 text-zinc-400">
        Computed from Aave repayments, Uniswap LP duration, staking age, 
        transaction volume, and on-chain identity verification.
      </p>
      
      <div className="mt-6 flex gap-3">
        <button 
          className="rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
          onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank')}
        >
          View IPFS JSON
        </button>
      </div>
    </div>
  );
}