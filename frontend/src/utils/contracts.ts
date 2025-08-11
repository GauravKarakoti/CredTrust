import { ethers } from "ethers";

// Replace with your actual contract ABIs
export const TrustTokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)",
  "function approve(address,uint256) returns (bool)"
];

export const TrustSwapABI = [
  "function swapTokens() payable",
  "function setSwapRate(uint256)",
];

export const CredTrustRegistryABI = [
  "function stakeForUser(address, uint256)",
  "function unstake(uint256)",
  "function getScore(address) view returns (uint256)",
  "function getAttestations(address) view returns (tuple(address,uint256,uint256)[])",
  "event Attested(address indexed user, address indexed attester, uint256 amount)",
  "function updateScore(address,(uint256,uint256,uint256,uint256,uint256),string)"
];

export const LoanContractABI = [
  "function applyForLoan(uint256)",
  "function addLoanProduct(uint256,uint256,uint256,bool)",
  "function getLoanProductCount() view returns (uint256)",
  "function getLoanProduct(uint256) view returns ((uint256,uint256,uint256,bool))"
];

// Replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  trustToken: "0x400279668ED8f2B8873FF256a5719AbBbbe7670F",
  trustSwap: "0x2741e9f552B975A91C90fd5E6f39Aaa8E67dFAd1",
  credTrustRegistry: "0x776Ad32c837737De4B493637c0Fa7F052Ef0d0dE",
  loanContract: "0xBe931B3CF64E3E16143C4BC24861f563cEee635D",
};

export const getContract = (
  address: string,
  abi: any,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};