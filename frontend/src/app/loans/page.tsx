"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { 
  CONTRACT_ADDRESSES, 
  LoanContractABI,
  getContract 
} from "../../utils/contracts";
import { type Loan } from "../../types";

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      if (!window.ethereum) {
        setError("Please install a wallet like MetaMask.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const loanContract = getContract(
          CONTRACT_ADDRESSES.loanContract,
          LoanContractABI,
          provider
        );

        const loanCount = await loanContract.getLoanProductCount();
        const loansData: Loan[] = [];
        
        for (let i = 0; i < Number(loanCount); i++) {
          const loan = await loanContract.getLoanProduct(i);
          loansData.push({
            id: i,
            amount: ethers.formatEther(loan[0]),
            interestRate: loan[1],
            duration: loan[2],
            collateralized: loan[3]
          });
        }

        setLoans(loansData);
        setError("");
      } catch (err: unknown) { // Use unknown for errors
        console.error("Error fetching loans:", err);
        setError("Failed to load loan products.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleApplyForLoan = async (productId: number) => {
    if (!window.ethereum) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const loanContract = getContract(
        CONTRACT_ADDRESSES.loanContract,
        LoanContractABI,
        signer
      );

      const tx = await loanContract.applyForLoan(productId);
      await tx.wait();
      alert("Loan application submitted successfully!");
    } catch (error: unknown) { // Use unknown for errors
      console.error("Loan application failed:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Available Loans</h1>
            <p className="text-zinc-400 mt-2">
              Browse and apply for under-collateralized loans based on your credit score
            </p>
          </div>
          <Link href="/" className="text-emerald-500 hover:text-emerald-400">
            ← Back to Dashboard
          </Link>
        </header>

        {error && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <div 
              key={loan.id}
              className="border border-zinc-800 rounded-xl bg-zinc-900/40 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">
                    {loan.amount} ETH Loan
                  </h3>
                  <div className="mt-1 text-emerald-400 text-2xl font-bold">
                    {Number(loan.interestRate) / 100}% APR
                  </div>
                </div>
                <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm shrink-0">
                  {loan.collateralized ? "Collateralized" : "Uncollateralized"}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{Math.floor(Number(loan.duration) / 86400)} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Min. Credit Score</span>
                  <span>700</span>
                </div>
                <div className="flex justify-between">
                  <span>Collateral Required</span>
                  <span>{loan.collateralized ? "Yes" : "No"}</span>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg transition-colors"
                onClick={() => handleApplyForLoan(loan.id)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <h2 className="text-xl font-medium mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-800 rounded-xl p-5">
              <div className="text-emerald-500 text-2xl mb-3">1</div>
              <h3 className="font-medium">Check Eligibility</h3>
              <p className="text-zinc-400 mt-2">
                Ensure your credit score meets the minimum requirements for the loan product
              </p>
            </div>
            <div className="border border-zinc-800 rounded-xl p-5">
              <div className="text-emerald-500 text-2xl mb-3">2</div>
              <h3 className="font-medium">Apply</h3>
              <p className="text-zinc-400 mt-2">
                Submit your application with a single click - no paperwork needed
              </p>
            </div>
            <div className="border border-zinc-800 rounded-xl p-5">
              <div className="text-emerald-500 text-2xl mb-3">3</div>
              <h3 className="font-medium">Receive Funds</h3>
              <p className="text-zinc-400 mt-2">
                Get funds directly to your wallet upon approval in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}