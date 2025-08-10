"use client";

import router from "next/router";
import { useContracts } from "../../hooks/useContract";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function CreditGateModal({ 
  isOpen, 
  onClose,
  score
}: { 
  isOpen: boolean; 
  onClose: () => void;
  score: number;
}) {
  const { loanContract } = useContracts();
  const [loanProducts, setLoanProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      if (loanContract) {
        try {
          const loanCount = await loanContract.getLoanProductCount();
          const loans: any[] = [];
          
          for (let i = 0; i < loanCount; i++) {
            const loan = await loanContract.loanProducts(i);
            loans.push({
              id: i,
              amount: ethers.formatEther(loan.amount),
              interestRate: loan.interestRate,
              duration: loan.duration,
              collateralized: loan.collateralized
            });
          }
          
          setLoanProducts(loans);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      }
    };
    
    fetchLoans();
  }, [loanContract]);
  if (!isOpen) return null;

  const isApproved = score >= 700;

  const handleExploreLoans = () => {
    router.push('/loans');
  }

  const handleUnderstandScore = () => {
    router.push('/score-education');
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800">
        <h3 className="text-xl font-medium mb-4">Credit Gate Result</h3>
        
        <div className={`rounded-lg p-4 mb-4 ${isApproved ? 'bg-emerald-900/30' : 'bg-rose-900/30'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}</div>
            <div className={`text-lg font-medium ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isApproved ? "Credit Approved!" : "Credit Denied"}
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-400 mb-4">
          {isApproved 
            ? "Congratulations! You qualify for under-collateralized loans. Your credit score meets our minimum requirement of 700."
            : "Your credit score is below the minimum requirement of 700. To qualify for under-collateralized loans, you need to improve your score by:"}
        </div>

        {!isApproved && (
          <div className="bg-zinc-800/50 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Required Score</span>
              <span>700</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Your Score</span>
              <span>{score}</span>
            </div>
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>Points Needed</span>
              <span className="text-amber-400">{700 - score}</span>
            </div>
          </div>
        )}

        <button 
          className="w-full rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
          onClick={isApproved ? handleExploreLoans : handleUnderstandScore}
        >
          {isApproved ? "Explore Loan Options" : "Understand My Score"}
        </button>
      </div>
    </div>
  );
}