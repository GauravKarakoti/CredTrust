// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TransactionVolumeMock {
    mapping(address => uint256) private txCount;

    function getTxVolume(address user) external view returns (uint256) {
        return txCount[user];
    }

    // A mock function to simulate a transaction and update the volume count
    function mockTransaction() external {
        txCount[msg.sender]++;
    }
}