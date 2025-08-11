"use client";

import Link from "next/link";
import { useState } from "react";

export default function ScoreEducationPage() {
  const [activeSection, setActiveSection] = useState("factors");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Credit Score Education</h1>
              <p className="text-zinc-400 mt-2">
                Understand how your credit score is calculated and how to improve it
              </p>
            </div>
            <Link href="/" className="text-emerald-500 hover:text-emerald-400">
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="mt-8 flex border-b border-zinc-800">
            <button
              className={`pb-3 px-4 ${activeSection === "factors" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-zinc-400"}`}
              onClick={() => setActiveSection("factors")}
            >
              Score Factors
            </button>
            <button
              className={`pb-3 px-4 ${activeSection === "improve" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-zinc-400"}`}
              onClick={() => setActiveSection("improve")}
            >
              Improve Your Score
            </button>
            <button
              className={`pb-3 px-4 ${activeSection === "faq" ? "border-b-2 border-emerald-500 text-emerald-500" : "text-zinc-400"}`}
              onClick={() => setActiveSection("faq")}
            >
              FAQ
            </button>
          </div>
        </header>

        {activeSection === "factors" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">How Your Score is Calculated</h2>
              <p className="text-zinc-300 mb-6">
                Your CredTrust score is calculated using on-chain data from various DeFi protocols.
                Each factor contributes differently to your overall score (out of 900).
              </p>
              
              <div className="space-y-4">
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Aave Repayment History</h3>
                    <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full">
                      40% Weight
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    Tracks your repayment consistency on Aave loans. Consistent, on-time repayments
                    boost your score significantly.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Uniswap LP Duration</h3>
                    <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full">
                      30% Weight
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    Measures how long you've provided liquidity in Uniswap pools. Longer commitments
                    demonstrate stability.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Staking History</h3>
                    <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full">
                      20% Weight
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    Evaluates your staking duration and consistency across protocols. Shows long-term
                    commitment to the ecosystem.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Transaction Volume</h3>
                    <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full">
                      5% Weight
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    Measures your overall transaction activity. Regular, moderate activity is better
                    than sporadic large transactions.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Identity Verification</h3>
                    <span className="bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full">
                      5% Weight
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-2">
                    Verifies your identity through on-chain attestations. Confirmed identity adds a
                    trust boost to your score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "improve" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Improve Your Credit Score</h2>
              <p className="text-zinc-300 mb-6">
                Follow these strategies to boost your creditworthiness and unlock better financial opportunities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-zinc-800 rounded-xl p-5 bg-emerald-900/10">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Consistent Aave Repayments</h3>
                  <p className="text-zinc-400 mt-2">
                    Take small loans on Aave and repay them consistently on time. This has the
                    highest impact on your score.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Long-Term Liquidity Provision</h3>
                  <p className="text-zinc-400 mt-2">
                    Provide liquidity to Uniswap pools and maintain it for extended periods.
                    Avoid frequently adding/removing funds.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Stake for Longer Durations</h3>
                  <p className="text-zinc-400 mt-2">
                    Stake your tokens in reputable protocols and avoid unstaking frequently.
                    Long-term stakes significantly boost your score.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Regular Activity</h3>
                  <p className="text-zinc-400 mt-2">
                    Maintain consistent transaction activity. Avoid long periods of inactivity
                    followed by bursts of transactions.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Verify Your Identity</h3>
                  <p className="text-zinc-400 mt-2">
                    Complete identity verification through trusted attestation services.
                    This adds credibility to your wallet.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <div className="text-emerald-500 text-xl mb-2">✓</div>
                  <h3 className="font-medium">Get Attestations</h3>
                  <p className="text-zinc-400 mt-2">
                    Ask trusted parties to stake TRUST tokens on your behalf. Quality attestations
                    can boost your credibility.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
              <h3 className="font-medium text-lg mb-3">Score Improvement Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Immediate Actions (0-7 days)</h4>
                    <p className="text-zinc-400">
                      Start repaying small loans, provide liquidity, and verify identity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Short-Term (1-4 weeks)</h4>
                    <p className="text-zinc-400">
                      Maintain consistent activity, extend staking periods, get attestations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Long-Term (1-3 months+)</h4>
                    <p className="text-zinc-400">
                      Build repayment history, establish long-term liquidity positions, 
                      accumulate positive attestations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "faq" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-lg">How often is my credit score updated?</h3>
                  <p className="text-zinc-400 mt-2">
                    Your credit score updates in real-time as new on-chain activities are detected.
                    However, significant changes may take up to 24 hours to reflect.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-lg">Why did my score decrease?</h3>
                  <p className="text-zinc-400 mt-2">
                    Common reasons for score decreases include: missed loan repayments, 
                    removing liquidity from pools, unstaking tokens, or long periods of inactivity.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-lg">How do attestations affect my score?</h3>
                  <p className="text-zinc-400 mt-2">
                    Attestations don't directly change your score number, but they add credibility
                    to your profile. Lenders may consider accounts with quality attestations as
                    lower risk.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-lg">Is my personal information stored on-chain?</h3>
                  <p className="text-zinc-400 mt-2">
                    No personally identifiable information is stored on-chain. Identity verification
                    uses zero-knowledge proofs to confirm your identity without revealing sensitive data.
                  </p>
                </div>
                
                <div className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-medium text-lg">Can I see why I was denied a loan?</h3>
                  <p className="text-zinc-400 mt-2">
                    Yes, if you're denied a loan, you'll receive specific reasons related to your credit profile,
                    such as insufficient score, lack of repayment history, or inadequate attestations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
              <h3 className="font-medium text-lg mb-3">Need More Help?</h3>
              <p className="text-zinc-400 mb-4">
                Contact our support team or join our community for assistance:
              </p>
              <div className="flex gap-3">
                <button className="border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800">
                  Contact Support
                </button>
                <button className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700">
                  Join Discord
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}