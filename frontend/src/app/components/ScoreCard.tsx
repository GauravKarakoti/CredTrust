"use client";

import ScoreChart from "./ScoreChart";
import { cn } from "../../lib/utils";

// The component now only needs to know about the props it will receive
interface ScoreCardProps {
  score: number;
  loading: boolean;
  isRecalculating: boolean;
  onRecalculate: () => void;
  onViewIPFS: () => void;
}

export default function ScoreCard({
  score,
  loading,
  isRecalculating,
  onRecalculate,
  onViewIPFS,
}: ScoreCardProps) {
  // This is now a "presentational" component.

  const scoreLevel = score >= 800 ? "Excellent" :
                     score >= 700 ? "Good" :
                     score >= 600 ? "Fair" : "Poor";

  const levelColor = {
    Excellent: "text-emerald-400",
    Good: "text-amber-400",
    Fair: "text-orange-500",
    Poor: "text-rose-500"
  };

  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 900 - score }
  ];

  if (loading) {
    return (
      <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-zinc-400">Fetching score...</p>
      </div>
    );
  }

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
          onClick={onViewIPFS}
        >
          View IPFS JSON
        </button>
        <button
          className="rounded-md border border-emerald-700 bg-emerald-900/30 px-4 py-2 text-emerald-300 hover:bg-emerald-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onRecalculate}
          disabled={isRecalculating}
        >
          {isRecalculating ? "Recalculating..." : "Recalculate Score"}
        </button>
      </div>
    </div>
  );
}