// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TrustToken.sol";

contract TrustSwap {
    TrustToken public trustToken;
    uint256 public swapRate = 100; // 1 ETH = 100 TRUST
    
    event TokensSwapped(address indexed user, uint256 ethAmount, uint256 tokenAmount);
    
    constructor(address _trustTokenAddress) {
        trustToken = TrustToken(_trustTokenAddress);
    }
    
    function swapTokens() external payable {
        uint256 tokenAmount = msg.value * swapRate;
        require(
            trustToken.balanceOf(address(this)) >= tokenAmount,
            "Insufficient contract balance"
        );
        trustToken.transfer(msg.sender, tokenAmount);
        emit TokensSwapped(msg.sender, msg.value, tokenAmount);
    }
    
    function setSwapRate(uint256 newRate) external {
        require(newRate > 0, "Invalid rate");
        swapRate = newRate;
    }
    
    function withdrawETH() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}