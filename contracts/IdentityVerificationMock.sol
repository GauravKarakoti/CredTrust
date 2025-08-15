// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityVerificationMock {
    mapping(address => bool) private verified;

    function isVerified(address user) external view returns (bool) {
        return verified[user];
    }

    // A mock function to allow the owner to verify an address
    function setVerified(address user, bool status) external {
        verified[user] = status;
    }
}