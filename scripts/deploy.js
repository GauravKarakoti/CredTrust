const { ethers } = require("hardhat");

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

  // --- NEW: Fund the TrustSwap contract ---
  console.log("Funding TrustSwap contract with TRUST tokens...");
  // Define how many tokens to send. Let's send 500,000 tokens.
  // We use parseUnits to handle the 18 decimals of the ERC20 token.
  const amountToFund = ethers.parseUnits("500000", 18);
  
  // Call the transfer function on the TrustToken contract
  const tx = await trustToken.transfer(trustSwap.target, amountToFund);
  await tx.wait(); // Wait for the transaction to be mined
  
  console.log(`Successfully transferred ${ethers.formatUnits(amountToFund, 18)} TRUST to ${trustSwap.target}`);
  // --- END OF NEW CODE ---

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
  const fs = require("fs");
  const contracts = {
    trustToken: trustToken.target,
    trustSwap: trustSwap.target,
    credTrustRegistry: credTrustRegistry.target,
    loanContract: loanContract.target
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