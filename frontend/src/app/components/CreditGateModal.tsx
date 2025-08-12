"use client";

import { useRouter } from "next/navigation";
import { useContracts } from "../../hooks/useContract";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { type Loan, type LoanStruct } from "../../types";

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
  const [loanProducts, setLoanProducts] = useState<Loan[]>([]); // Use Loan type
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      if (loanContract) {
        try {
          const loanCount = await loanContract.getLoanProductCount();
          const loans: Loan[] = []; // Use Loan type
          
          for (let i = 0; i < Number(loanCount); i++) {
            // FIX: You must call getLoanProduct(i) and access by index
            const loan: LoanStruct = await loanContract.getLoanProduct(i);
            loans.push({
              id: i,
              amount: ethers.formatEther(loan[0]),
              interestRate: loan[1],
              duration: loan[2],
              collateralized: loan[3]
            });
          }
          
          setLoanProducts(loans);
        } catch (error: unknown) { // Use unknown for errors
          console.error("Error fetching loans:", error);
        }
      }
    };
    
    if (isOpen) {
      fetchLoans();
    }
  }, [loanContract, isOpen]);

  if (!isOpen) return null;

  const isApproved = score >= 700;

  const handleExploreLoans = () => {
    // We'll close the modal before navigating
    onClose(); 
    router.push('/loans');
  }

  const handleUnderstandScore = () => {
    onClose();
    router.push('/score-education');
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800">
        
        {/* NEW: "X" button in the top-right corner */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

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
            : "Your credit score is below the minimum requirement of 700. To qualify for under-collateralized loans, you need to improve your score."}
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

        {/* NEW: Button container to hold both actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            className="w-full rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
            onClick={isApproved ? handleExploreLoans : handleUnderstandScore}
          >
            {isApproved ? "Explore Loan Options" : "Understand My Score"}
          </button>
        </div>
      </div>
    </div>
  );
}