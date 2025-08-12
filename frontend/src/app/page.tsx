"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import WalletButton from "./components/WalletButton";
import ScoreCard from "./components/ScoreCard";
import AttestationsCard from "./components/AttestationsCard";
import CreditGateModal from "./components/CreditGateModal";
import { ethers, parseEther } from "ethers";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { 
  CONTRACT_ADDRESSES, 
  TrustSwapABI,
  LoanContractABI,
  CredTrustRegistryABI,
  getContract 
} from "../utils/contracts";
import { type Loan, type LoanStruct } from "../types";

const swapContractAddress = "0x418103499076ad5731F07c06881f101c3539BC86";

export default function Home() {
  const [score, setScore] = useState<number>(0);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");
  
  const [isCreditGateOpen, setIsCreditGateOpen] = useState(false);
  const [isIPFSModalOpen, setIsIPFSModalOpen] = useState(false);
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([]);
  
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  
  const signer = useEthersSigner();

  const fetchScore = useCallback(async () => {
    if (signer) {
      try {
        setScoreLoading(true);
        const address = await signer.getAddress();
        const registry = getContract(
          CONTRACT_ADDRESSES.credTrustRegistry,
          CredTrustRegistryABI,
          signer
        );
        const userScore = await registry.getScore(address);
        setScore(Number(userScore));
      } catch (error) {
        console.error("Error fetching score:", error);
        setScore(0);
      } finally {
        setScoreLoading(false);
      }
    } else {
      setScoreLoading(false);
      setScore(0);
    }
  }, [signer]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  const handleRecalculateScore = async () => {
    if (!signer) {
      alert("Please connect your wallet to recalculate your score.");
      return;
    }
    
    setIsRecalculating(true);
    try {
      const address = await signer.getAddress();
      const registry = getContract(
        CONTRACT_ADDRESSES.credTrustRegistry,
        CredTrustRegistryABI,
        signer
      );

      // The factors array no longer includes the staked amount directly,
      // as the smart contract now adds it. The order must match the updated struct.
      const factorsAsArray = [
        Math.floor(Math.random() * 101), // aaveRepayments
        Math.floor(Math.random() * 101), // uniswapLpDuration
        0,                               // Placeholder for stakedAmount (contract will fill this)
        Math.floor(Math.random() * 101), // transactionVolume
        Math.random() > 0.5 ? 100 : 0    // identityVerified
      ];
      
      const newIpfsHash = `QmRecalc${Math.random().toString(36).substring(2, 10)}`;
      
      // The contract's updateScore function now internally handles the staked amount
      const tx = await registry.updateScore(address, factorsAsArray, newIpfsHash);
      await tx.wait();
      
      setIpfsHash(newIpfsHash);
      await fetchScore();
      alert("Score updated successfully!");

    } catch (error) {
      console.error("Error recalculating score:", error);
      alert("Failed to recalculate score. See console for details.");
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleViewIPFS = () => {
    if (ipfsHash) {
      window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank');
    } else {
      alert("Recalculate score first to generate an IPFS hash.");
    }
  };

  useEffect(() => {
    // Fetches all available loan products
    const fetchAvailableLoans = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const loanContract = getContract(CONTRACT_ADDRESSES.loanContract, LoanContractABI, provider);
        try {
          const loanCount = await loanContract.getLoanProductCount();
          const loansData: Loan[] = []; // Use Loan type
        for (let i = 0; i < Number(loanCount); i++) {
          const loan: LoanStruct = await loanContract.getLoanProduct(i);
            loansData.push({
              id: i,
              amount: ethers.formatEther(loan[0]),
              interestRate: loan[1],
              duration: loan[2],
              collateralized: loan[3]
            });
          }
          setAvailableLoans(loansData);
        } catch (error) {
          console.error("Error fetching available loans:", error);
        }
      }
    };

    fetchAvailableLoans();
  }, []);

  // NEW: Effect to fetch the user's applied-for loans
  useEffect(() => {
    const fetchMyLoans = async () => {
      if (signer) {
        const address = await signer.getAddress();
        const loanContract = getContract(CONTRACT_ADDRESSES.loanContract, LoanContractABI, signer);
        try {
          // 1. Get the array of applied loan IDs
          const myLoanIds = await loanContract.getAppliedLoans(address);

          // 2. For each ID, fetch the full loan details
          const myLoansData = await Promise.all(
            myLoanIds.map(async (id: bigint) => {
              const loan = await loanContract.getLoanProduct(id);
              return {
                id: Number(id),
                amount: ethers.formatEther(loan[0]),
                interestRate: loan[1],
                duration: loan[2],
                collateralized: loan[3]
              };
            })
          );
          setMyLoans(myLoansData);
        } catch (error) {
          console.error("Error fetching my loans:", error);
        }
      }
    };

    fetchMyLoans();
  }, [signer]);

  const handleApplyForLoan = async (productId: number) => {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const loanContract = getContract(CONTRACT_ADDRESSES.loanContract, LoanContractABI, signer);
      const tx = await loanContract.applyForLoan(productId);
      await tx.wait();
      alert("Loan application submitted successfully!");
      // Refresh the list of "My Loans" after applying
      const address = await signer.getAddress();
      const myLoanIds = await loanContract.getAppliedLoans(address);
      const myLoansData = await Promise.all(
        myLoanIds.map(async (id: bigint) => {
          const loan = await loanContract.getLoanProduct(id);
          return {
            id: Number(id),
            amount: ethers.formatEther(loan[0]),
            interestRate: loan[1],
            duration: loan[2],
            collateralized: loan[3]
          };
        })
      );
      setMyLoans(myLoansData);
    } catch (error: unknown) { // FIX: Use unknown and perform type check
      console.error("Loan application failed:", error);
      let message = "Loan application failed";
      if (error instanceof Error) {
        // Ethers errors often have a 'reason' property
        const ethersError = error as Error & { reason?: string };
        message = ethersError.reason || error.message;
      }
      alert(`Error: ${message}`);
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

    } catch (error: unknown) {
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
    contractAddress: "0xec71298971071c4aF4cEa2536C045737e4569961"
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

        <section className="mt-8 grid grid-cols-1 gap-6 md-grid-cols-2 lg:grid-cols-3">
          <ScoreCard 
            score={score}
            loading={scoreLoading}
            isRecalculating={isRecalculating}
            onRecalculate={handleRecalculateScore}
            onViewIPFS={handleViewIPFS}
          />
          <AttestationsCard />
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-lg font-medium">Available Loans</h3>
            <div className="mt-4 space-y-3">
              {availableLoans.map((loan) => (
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
              }
            </div>
          </div>
          <button onClick={handleSwap} className="rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800">Swap ETH for TRUST</button>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-lg font-medium">Developer</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                <Link href="https://etherscan.io/address/0xec71298971071c4aF4cEa2536C045737e4569961" className="underline underline-offset-4 hover:text-zinc-100">
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 md:col-span-2">
            <h3 className="text-lg font-medium">Your Applied Loans</h3>
            <div className="mt-4 space-y-3">
              {myLoans.length > 0 ? (
                myLoans.map((loan) => (
                  <div key={loan.id} className="p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{loan.amount} ETH</span>
                      <span className="text-sm text-emerald-400">Application Submitted</span>
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {Number(loan.interestRate) / 100}% APR • {Math.floor(Number(loan.duration) / 86400)} days
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">You have not applied for any loans yet.</p>
              )}
            </div>
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