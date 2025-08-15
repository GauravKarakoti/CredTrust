// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This contract is a simplified representation for demonstration purposes.
// A real-world application might integrate with a Uniswap V2 or V3 Router.

contract Uniswap_LP {
    // Mapping to store the timestamp of the first LP deposit for each user.
    mapping(address => uint256) public lpDepositTimestamp;

    event LPDeposited(address indexed user, uint256 timestamp);

    /**
     * @dev Records a user's LP deposit. This function is called by the frontend
     * when a user deposits LP tokens. It only records the first deposit to
     * measure the duration of continuous liquidity provision.
     */
    function depositLP() external {
        // Only record the timestamp if it's the user's first deposit.
        if (lpDepositTimestamp[msg.sender] == 0) {
            lpDepositTimestamp[msg.sender] = block.timestamp;
            emit LPDeposited(msg.sender, block.timestamp);
        }
    }

    /**
     * @dev Returns the duration of a user's liquidity provision in seconds.
     * @param user The address of the user.
     * @return The duration in seconds. Returns 0 if no deposit has been made.
     */
    function getLPDuration(address user) external view returns (uint256) {
        uint256 timestamp = lpDepositTimestamp[user];
        if (timestamp == 0) {
            return 0;
        }
        return block.timestamp - timestamp;
    }
}