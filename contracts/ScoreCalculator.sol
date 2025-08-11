// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ScoreCalculator {
    struct ScoreFactors {
        uint256 aaveRepayments;
        uint256 uniswapLpDuration;
        // stakingAge is now replaced by the actual staked amount for a more direct impact
        uint256 stakedAmount; 
        uint256 transactionVolume;
        uint256 identityVerified;
    }
    
    // Weights are adjusted to include staking amount (sum remains 1000)
    uint256 constant AAVE_WEIGHT = 350;      // Reduced from 400
    uint256 constant UNISWAP_WEIGHT = 250;   // Reduced from 300
    uint256 constant STAKING_WEIGHT = 250;   // New weight for staked amount
    uint256 constant TX_WEIGHT = 100;        // Increased from 50
    uint256 constant ID_WEIGHT = 50;
    
    function calculateScore(
        ScoreFactors memory factors
    ) public pure returns (uint256) {
        uint256 score = 0;
        
        score += (factors.aaveRepayments * AAVE_WEIGHT) / 100;
        score += (factors.uniswapLpDuration * UNISWAP_WEIGHT) / 100;
        
        // New calculation for staked amount: score increases with amount staked, capped at 100.
        // This logic gives a max of 250 points (100 * 250 / 100).
        // Staking 1000 TRUST or more gives the maximum staking score.
        uint256 stakingScore = (factors.stakedAmount * 100) / (1000 * 10**18);
        if (stakingScore > 100) {
            stakingScore = 100;
        }
        score += (stakingScore * STAKING_WEIGHT) / 100;

        score += (factors.transactionVolume * TX_WEIGHT) / 100;
        score += (factors.identityVerified * ID_WEIGHT) / 100;
        
        return score > 900 ? 900 : score;
    }
}