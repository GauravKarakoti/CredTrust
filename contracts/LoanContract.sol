// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CredTrustRegistry.sol";

contract LoanContract {
    CredTrustRegistry public registry;
    uint256 public constant MIN_SCORE = 700;
    
    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        bool collateralized;
    }
    
    Loan[] public loanProducts;
    
    event LoanApproved(address indexed borrower, uint256 productId);
    
    constructor(address _registryAddress) {
        registry = CredTrustRegistry(_registryAddress);
        
        // Initialize loan products
        loanProducts.push(Loan(1 ether, 500, 30 days, false));  // 5% APR
        loanProducts.push(Loan(5 ether, 300, 90 days, true));   // 3% APR
    }
    
    function applyForLoan(uint256 productId) external {
        require(productId < loanProducts.length, "Invalid product");
        Loan memory product = loanProducts[productId];
        
        uint256 score = registry.getScore(msg.sender);
        require(score >= MIN_SCORE, "Credit score too low");
        
        if (!product.collateralized) {
            require(score >= 750, "Higher score required for uncollateralized");
        }
        
        // Implement actual loan disbursement logic here
        emit LoanApproved(msg.sender, productId);
    }

    function getLoanProduct(uint256 index) public view returns (Loan memory) {
        require(index < loanProducts.length, "Invalid product index");
        return loanProducts[index];
    }
    
    function getLoanProductCount() public view returns (uint256) {
        return loanProducts.length;
    }

    function addLoanProduct(
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        bool collateralized
    ) external {
        loanProducts.push(Loan(amount, interestRate, duration, collateralized));
    }
}