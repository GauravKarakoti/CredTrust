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
  "function getStakedAmount(address) view returns (uint256)" // Added missing function
];

export const CredTrustRegistryABI = [
  "function stakeForUser(address, uint256)",
  "function unstake(uint256)",
  "function getScore(address) view returns (uint256)",
  "function getAttestations(address) view returns (tuple(address,uint256,uint256)[])",
  "event Attested(address indexed user, address indexed attester, uint256 amount)",
  "function updateScore(address,tuple(uint256,uint256,uint256,uint256,uint256),string)", // Corrected struct type
  "function getStakedAmount(address) view returns (uint256)"
];

export const LoanContractABI = [
  "function applyForLoan(uint256)",
  "function addLoanProduct(uint256,uint256,uint256,bool)",
  "function getLoanProductCount() view returns (uint256)",
  "function getLoanProduct(uint256) view returns ((uint256,uint256,uint256,bool))",
  "function getAppliedLoans(address) view returns (uint256[])"
];

// New ABIs for the mock contracts
export const UNISWAP_LP_ABI = [
  "function depositLP()",
  "function getLPDuration(address user) view returns (uint256)",
  "function lpDepositTimestamp(address) view returns (uint256)" // Added public state variable
];

export const AAVE_MOCK_ABI = [
  "function getRepayments(address user) view returns (uint256)",
  "function mockRepayment()"
];

export const TX_VOLUME_MOCK_ABI = [
  "function getTxVolume(address user) view returns (uint256)",
  "function mockTransaction()"
];

export const IDENTITY_VERIFICATION_ABI = [
  "function isVerified(address user) view returns (bool)",
  "function setVerified(address user, bool status)"
];


// **IMPORTANT**: Replace these addresses with the actual ones after deployment.
export const CONTRACT_ADDRESSES = {
  trustToken: "0x336Ed6256628aB795C4fEd282095385Eb4562280",
  trustSwap: "0xecd5de94D0331279367fA8AA5b5f56Cce151bf3d",
  uniswapLP: "0x301a5904cCBd2D7ccaA43B44320387Bdc18AAB5d",
  aaveMock: "0xec7f56248907B216EDE4404ec9c02dc592BA10B6",
  transactionVolumeMock: "0xaa8a07Ae8B0D7815C7C7d2E1c416e132C9eDA986",
  identityVerificationMock: "0xa380ff35C6892FB2F7BCc3D67558Aa887ff50d56",
  credTrustRegistry: "0x51291d5A706a262662E424AB4E9E75CA60df16d5",
  loanContract: "0x2f0ACb585005dDD59d87003FfB0970F782A4be3F",
};

export const getContract = (
  address: string, 
  abi: ethers.InterfaceAbi, 
  runner: ethers.ContractRunner | null // Allow null for read-only instances
) => {
  return new ethers.Contract(address, abi, runner);
};