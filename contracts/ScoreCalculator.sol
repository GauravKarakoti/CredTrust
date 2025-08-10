// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ScoreCalculator {
    struct ScoreFactors {
        uint256 aaveRepayments;
        uint256 uniswapLpDuration;
        uint256 stakingAge;
        uint256 transactionVolume;
        uint256 identityVerified;
    }
    
    // Weights for each factor (sum to 1000 = 100%)
    uint256 constant AAVE_WEIGHT = 400;
    uint256 constant UNISWAP_WEIGHT = 300;
    uint256 constant STAKING_WEIGHT = 200;
    uint256 constant TX_WEIGHT = 50;
    uint256 constant ID_WEIGHT = 50;
    
    function calculateScore(
        ScoreFactors memory factors
    ) public pure returns (uint256) {
        uint256 score = 0;
        
        score += (factors.aaveRepayments * AAVE_WEIGHT) / 100;
        score += (factors.uniswapLpDuration * UNISWAP_WEIGHT) / 100;
        score += (factors.stakingAge * STAKING_WEIGHT) / 100;
        score += (factors.transactionVolume * TX_WEIGHT) / 100;
        score += (factors.identityVerified * ID_WEIGHT) / 100;
        
        // Cap score at 900
        return score > 900 ? 900 : score;
    }
}