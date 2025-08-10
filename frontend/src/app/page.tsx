"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WalletButton from "./components/WalletButton";
import ScoreCard from "./components/ScoreCard";
import AttestationsCard from "./components/AttestationsCard";
import CreditGateModal from "./components/CreditGateModal";
import { ethers, parseEther } from "ethers";
import { useEthersSigner } from "../hooks/useEthersSigner"; // Import the hook
import { 
  CONTRACT_ADDRESSES, 
  TrustSwapABI,
  LoanContractABI,
  getContract 
} from "../utils/contracts";

const swapContractAddress = "0x5f5AdF7313793Ba2d2F4290B64d44994bC33B92c";

export default function Home() {
  const [score, setScore] = useState<number>(750);
  const [isCreditGateOpen, setIsCreditGateOpen] = useState(false);
  const [isIPFSModalOpen, setIsIPFSModalOpen] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  
  // Get the signer from the connected wallet
  const signer = useEthersSigner();

  const handleRecalculate = () => {
    // ... (rest of the function is unchanged)
    const change = Math.floor(Math.random() * 41) - 20;
    setScore(Math.max(500, Math.min(900, score + change)));
  };

  const handleViewIPFS = () => {
    setIsIPFSModalOpen(true);
  };

  useEffect(() => {
    const fetchLoans = async () => {
      // FIX 1: Add a check for window.ethereum
      if (window.ethereum) {
        // FIX 1: Use `as any` assertion
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const loanContract = getContract(
          CONTRACT_ADDRESSES.loanContract,
          LoanContractABI,
          provider
        );

        try {
          // FIX 2: Call the correct getter function for array length
          const loanCount = await loanContract.getLoanProductCount();
          
          // FIX 3: Explicitly type the local array
          const loans: any[] = [];

          for (let i = 0; i < Number(loanCount); i++) {
            const loan = await loanContract.loanProducts(i);
            loans.push({
              id: i,
              amount: ethers.formatEther(loan.amount),
              interestRate: loan.interestRate,
              duration: loan.duration,
              collateralized: loan.collateralized
            });
          }

          setLoans(loans);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      }
    };

    fetchLoans();
  }, []);


  const handleApplyForLoan = async (productId: number) => {
    // FIX 4: Add a check for window.ethereum
    if (!window.ethereum) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      // FIX 4: Use `as any` assertion
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
    } catch (error: any) {
      console.error("Loan application failed:", error);
      alert(`Error: ${error.message || "Loan application failed"}`);
    }
  };

  const handleSwap = async () => {
    // 1. Check if the signer is available
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      // 2. Instantiate the contract correctly with address, ABI, and signer
      const swapContract = new ethers.Contract(swapContractAddress, TrustSwapABI, signer);
      
      // 3. Call the contract function
      console.log("Sending swap transaction...");
      const tx = await swapContract.swapTokens({ value: parseEther("0.0001") });
      
      console.log("Transaction sent:", tx.hash);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction confirmed!");
      alert("Swap successful!");

    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Check the console for details.");
    }
  }
  
  // ... (mockIPFSData and the rest of the return statement is unchanged)
  const mockIPFSData = {
    cid: "QmXyZ123abc456def789ghi",
    timestamp: new Date().toISOString(),
    score: score,
    components: {
      aaveRepayments: { score: 320, weight: 0.4 },
      uniswapLiquidity: { score: 220, weight: 0.3 },
      stakingAge: { score: 150, weight: 0.2 },
      transactionVolume: { score: 40, weight: 0.05 },
      identityVerification: { score: 20, weight: 0.05 }
    },
    attestations: [
      {
        cid: "QmAttestation1",
        amount: 500,
        currency: "TRUST",
        timestamp: "2023-10-15T14:30:00Z"
      }
    ],
    contractAddress: "0x2a1E673F30d34Edd455f175a2ebFb34079774d26"
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CredTrust</h1>
            <p className="text-zinc-400">Sepolia • Aave + Uniswap • TRUST</p>
          </div>
          <WalletButton />
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <ScoreCard />
          <AttestationsCard />
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-lg font-medium">Available Loans</h3>
            <div className="mt-4 space-y-3">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <div 
                    key={loan.id} 
                    className="p-3 border border-zinc-700 rounded-lg hover:bg-zinc-800/30 cursor-pointer"
                    onClick={() => handleApplyForLoan(loan.id)}
                  >
                    <div className="flex justify-between">
                      <span>{loan.amount} ETH</span>
                      <span className="text-emerald-400">{Number(loan.interestRate) / 100}% APR</span>
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {loan.collateralized ? "Collateralized" : "Uncollateralized"} • 
                      Duration: {Math.floor(Number(loan.duration) / 86400)} days
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No loan products available.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-lg font-medium">Developer</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                <Link href="https://etherscan.io/address/0x2a1E673F30d34Edd455f175a2ebFb34079774d26" className="underline underline-offset-4 hover:text-zinc-100">
                  Registry contract
                </Link>
              </li>
              <li>
                <Link href="#" className="underline underline-offset-4 hover:text-zinc-100">
                  Attestation contract
                </Link>
              </li>
              <li>
                <Link href="#" className="underline underline-offset-4 hover:text-zinc-100">
                  Subgraph
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-lg font-medium">Demo Consumer</h3>
            <p className="mt-2 text-zinc-300">
              A sample lender gating under-collateralized loans to score ≥ 700.
            </p>
            <button 
              className="mt-4 rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
              onClick={() => setIsCreditGateOpen(true)}
            >
              Try Credit Gate
            </button>
          </div>
        </section>
      </div>

      {/* IPFS JSON Modal */}
      {isIPFSModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-2xl border border-zinc-800 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Score Data on IPFS</h3>
              <button 
                className="text-zinc-500 hover:text-zinc-300"
                onClick={() => setIsIPFSModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-zinc-400">IPFS CID:</div>
              <div className="font-mono text-sm p-2 bg-zinc-800 rounded">
                {mockIPFSData.cid}
              </div>
            </div>
            
            <pre className="text-xs bg-zinc-800 p-4 rounded-lg overflow-auto">
              {JSON.stringify(mockIPFSData, null, 2)}
            </pre>
            
            <div className="mt-4 text-sm text-zinc-400">
              This data is stored on IPFS and verifiable on-chain. Any changes to your score
              will generate a new CID.
            </div>
          </div>
        </div>
      )}

      <CreditGateModal 
        isOpen={isCreditGateOpen} 
        onClose={() => setIsCreditGateOpen(false)}
        score={score}
      />
    </main>
  );
}