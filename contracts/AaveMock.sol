// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AaveMock {
    mapping(address => uint256) private repaymentCount;

    function getRepayments(address user) external view returns (uint256) {
        return repaymentCount[user];
    }

    // A mock function to simulate a repayment and update the count
    function mockRepayment() external {
        repaymentCount[msg.sender]++;
    }
}