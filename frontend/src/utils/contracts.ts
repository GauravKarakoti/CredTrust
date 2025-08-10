import { ethers } from "ethers";

// Replace with your actual contract ABIs
export const TrustTokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)",
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
];

export const LoanContractABI = [
  "function applyForLoan(uint256)",
  "function addLoanProduct(uint256,uint256,uint256,bool)",
  "function getLoanProductCount() view returns (uint256)"
];

// Replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  trustToken: "0xdCE4E96faB21c9B26D640197498b66CA86BCDA8e",
  trustSwap: "0x5f5AdF7313793Ba2d2F4290B64d44994bC33B92c",
  credTrustRegistry: "0x2a1E673F30d34Edd455f175a2ebFb34079774d26",
  loanContract: "0x51EeDD69581383cBeaDAC84Af00a33E96f7Fe1b2",
};

export const getContract = (
  address: string,
  abi: any,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};