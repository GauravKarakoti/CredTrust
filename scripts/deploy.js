const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Deploy TrustToken
  const TrustToken = await ethers.getContractFactory("TrustToken");
  const trustToken = await TrustToken.deploy();
  await trustToken.waitForDeployment();
  console.log("TrustToken deployed to:", trustToken.target);

  // Deploy TrustSwap
  const TrustSwap = await ethers.getContractFactory("TrustSwap");
  const trustSwap = await TrustSwap.deploy(trustToken.target);
  await trustSwap.waitForDeployment();
  console.log("TrustSwap deployed to:", trustSwap.target);

  // Fund the TrustSwap contract
  console.log("Funding TrustSwap contract with TRUST tokens...");
  const amountToFund = ethers.parseUnits("500000", 18);
  const tx = await trustToken.transfer(trustSwap.target, amountToFund);
  await tx.wait();
  console.log(`Successfully transferred ${ethers.formatUnits(amountToFund, 18)} TRUST to ${trustSwap.target}`);

  // Deploy Uniswap_LP
  const UniswapLP = await ethers.getContractFactory("Uniswap_LP");
  const uniswapLP = await UniswapLP.deploy();
  await uniswapLP.waitForDeployment();
  console.log("Uniswap_LP deployed to:", uniswapLP.target);

  // Deploy AaveMock
  const AaveMock = await ethers.getContractFactory("AaveMock");
  const aaveMock = await AaveMock.deploy();
  await aaveMock.waitForDeployment();
  console.log("AaveMock deployed to:", aaveMock.target);

  // Deploy TransactionVolumeMock
  const TransactionVolumeMock = await ethers.getContractFactory("TransactionVolumeMock");
  const transactionVolumeMock = await TransactionVolumeMock.deploy();
  await transactionVolumeMock.waitForDeployment();
  console.log("TransactionVolumeMock deployed to:", transactionVolumeMock.target);

  // Deploy IdentityVerificationMock
  const IdentityVerificationMock = await ethers.getContractFactory("IdentityVerificationMock");
  const identityVerificationMock = await IdentityVerificationMock.deploy();
  await identityVerificationMock.waitForDeployment();
  console.log("IdentityVerificationMock deployed to:", identityVerificationMock.target);

  // Deploy CredTrustRegistry
  const CredTrustRegistry = await ethers.getContractFactory("CredTrustRegistry");
  const credTrustRegistry = await CredTrustRegistry.deploy(trustToken.target);
  await credTrustRegistry.waitForDeployment();
  console.log("CredTrustRegistry deployed to:", credTrustRegistry.target);

  // Deploy LoanContract
  const LoanContract = await ethers.getContractFactory("LoanContract");
  const loanContract = await LoanContract.deploy(credTrustRegistry.target);
  await loanContract.waitForDeployment();
  console.log("LoanContract deployed to:", loanContract.target);

  // Save contract addresses to a file (for frontend)
  const contracts = {
    trustToken: trustToken.target,
    trustSwap: trustSwap.target,
    uniswapLP: uniswapLP.target,
    aaveMock: aaveMock.target,
    transactionVolumeMock: transactionVolumeMock.target,
    identityVerificationMock: identityVerificationMock.target,
    credTrustRegistry: credTrustRegistry.target,
    loanContract: loanContract.target,
  };

  fs.writeFileSync(
    "./frontend/src/app/contracts/contract-addresses.json",
    JSON.stringify(contracts, null, 2)
  );

  console.log("Contract addresses saved to frontend/src/app/contracts/contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });