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
  "function updateScore(address,(uint256,uint256,uint256,uint256,uint256),string)",
  "function getStakedAmount(address) view returns (uint256)"
];

export const LoanContractABI = [
  "function applyForLoan(uint256)",
  "function addLoanProduct(uint256,uint256,uint256,bool)",
  "function getLoanProductCount() view returns (uint256)",
  "function getLoanProduct(uint256) view returns ((uint256,uint256,uint256,bool))",
  "function getAppliedLoans(address) view returns (uint256[])"
];

// Replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  trustToken: "0x6Ff38A1413BfB528Ccd3966a40a41A9E6d2c0649",
  trustSwap: "0x418103499076ad5731F07c06881f101c3539BC86",
  credTrustRegistry: "0xec71298971071c4aF4cEa2536C045737e4569961",
  loanContract: "0x5a10C37C6dD8cFbb00c851a307fE9DDD2de59263",
};

export const getContract = (
  address: string,
  abi: any,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};