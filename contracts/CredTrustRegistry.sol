// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TrustToken.sol";
import "./ScoreCalculator.sol";

contract CredTrustRegistry is ScoreCalculator {
    TrustToken public trustToken;
    
    struct UserScore {
        uint256 score;
        uint256 lastUpdated;
        string ipfsHash;
    }
    
    struct Attestation {
        address attester;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => UserScore) public scores;
    mapping(address => Attestation[]) public attestations;
    mapping(address => uint256) public stakedAmounts;
    
    event ScoreUpdated(address indexed user, uint256 score, string ipfsHash);
    event Attested(address indexed user, address indexed attester, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    
    constructor(address _trustTokenAddress) {
        trustToken = TrustToken(_trustTokenAddress);
    }
    
    function updateScore(
        address user,
        ScoreFactors memory factors,
        string memory ipfsHash
    ) external {
        uint256 newScore = calculateScore(factors);
        scores[user] = UserScore(newScore, block.timestamp, ipfsHash);
        emit ScoreUpdated(user, newScore, ipfsHash);
    }
    
    function stakeForUser(address user, uint256 amount) external {
        trustToken.transferFrom(msg.sender, address(this), amount);
        stakedAmounts[msg.sender] += amount;
        
        attestations[user].push(Attestation({
            attester: msg.sender,
            amount: amount,
            timestamp: block.timestamp
        }));
        
        emit Attested(user, msg.sender, amount);
    }
    
    function unstake(uint256 amount) external {
        require(stakedAmounts[msg.sender] >= amount, "Insufficient stake");
        stakedAmounts[msg.sender] -= amount;
        trustToken.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }
    
    function getScore(address user) external view returns (uint256) {
        return scores[user].score;
    }
    
    function getAttestations(address user) external view returns (Attestation[] memory) {
        return attestations[user];
    }
}