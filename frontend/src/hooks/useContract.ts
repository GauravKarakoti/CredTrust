import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  TrustTokenABI,
  TrustSwapABI,
  CredTrustRegistryABI,
  LoanContractABI,
  getContract
} from '../utils/contracts';

export function useContracts() {
  const [trustToken, setTrustToken] = useState<ethers.Contract | null>(null);
  const [trustSwap, setTrustSwap] = useState<ethers.Contract | null>(null);
  const [registry, setRegistry] = useState<ethers.Contract | null>(null);
  const [loanContract, setLoanContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initContracts = async () => {
      if (typeof window.ethereum === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = new ethers.BrowserProvider(window.ethereum as any);

        setTrustToken(
          getContract(CONTRACT_ADDRESSES.trustToken, TrustTokenABI, provider)
        );
        
        setTrustSwap(
          getContract(CONTRACT_ADDRESSES.trustSwap, TrustSwapABI, provider)
        );
        
        setRegistry(
          getContract(CONTRACT_ADDRESSES.credTrustRegistry, CredTrustRegistryABI, provider)
        );
        
        setLoanContract(
          getContract(CONTRACT_ADDRESSES.loanContract, LoanContractABI, provider)
        );
      } catch (error: unknown) { // Use 'unknown' for safer error handling
        console.error("Error initializing contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    initContracts();
  }, []);

  return { 
    trustToken, 
    trustSwap, 
    registry, 
    loanContract,
    loading 
  };
}