// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AnkrFaucet
 * @dev A complete faucet contract for ANKR tokens on Neura Testnet
 * @notice All functionality in a single file - no imports
 */
contract AnkrFaucet {
    // ============ State Variables ============
    
    address public owner;
    bool public paused;
    uint256 public claimAmount;
    uint256 public cooldownTime;
    uint256 public totalDistributed;
    uint256 public totalClaims;
    
    // ============ Mappings ============
    
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimsPerUser;
    mapping(address => uint256) public totalReceivedPerUser;
    
    // ============ Events ============
    
    event Claimed(address indexed user, uint256 amount, uint256 timestamp);
    event ClaimAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event FundsDeposited(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "AnkrFaucet: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "AnkrFaucet: faucet is paused");
        _;
    }
    
    modifier nonReentrant() {
        require(!_locked, "AnkrFaucet: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }
    
    // ============ Reentrancy Guard ============
    
    bool private _locked;
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        claimAmount = 0.1 ether; // 0.1 ANKR default
        cooldownTime = 12 hours;
        paused = false;
        _locked = false;
    }
    
    // ============ Receive Function ============
    
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    // ============ User Functions ============
    
    /**
     * @dev Claim ANKR tokens from the faucet
     */
    function claim() external whenNotPaused nonReentrant {
        require(canClaim(msg.sender), "AnkrFaucet: cannot claim yet");
        require(address(this).balance >= claimAmount, "AnkrFaucet: insufficient faucet balance");
        
        // Update state before transfer (prevents reentrancy)
        lastClaimTime[msg.sender] = block.timestamp;
        totalClaimsPerUser[msg.sender] += 1;
        totalReceivedPerUser[msg.sender] += claimAmount;
        totalDistributed += claimAmount;
        totalClaims += 1;
        
        // Transfer ANKR
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "AnkrFaucet: transfer failed");
        
        emit Claimed(msg.sender, claimAmount, block.timestamp);
    }
    
    /**
     * @dev Check if an address can claim
     */
    function canClaim(address user) public view returns (bool) {
        if (lastClaimTime[user] == 0) {
            return true;
        }
        return block.timestamp >= lastClaimTime[user] + cooldownTime;
    }
    
    /**
     * @dev Get remaining cooldown time for an address
     */
    function getRemainingCooldown(address user) public view returns (uint256) {
        if (canClaim(user)) {
            return 0;
        }
        return (lastClaimTime[user] + cooldownTime) - block.timestamp;
    }
    
    /**
     * @dev Get next claim time for an address
     */
    function getNextClaimTime(address user) public view returns (uint256) {
        if (lastClaimTime[user] == 0) {
            return block.timestamp;
        }
        return lastClaimTime[user] + cooldownTime;
    }
    
    /**
     * @dev Get faucet balance
     */
    function getFaucetBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) public view returns (
        uint256 claims,
        uint256 received,
        uint256 lastClaim,
        uint256 nextClaim,
        bool eligible
    ) {
        claims = totalClaimsPerUser[user];
        received = totalReceivedPerUser[user];
        lastClaim = lastClaimTime[user];
        nextClaim = getNextClaimTime(user);
        eligible = canClaim(user);
    }
    
    /**
     * @dev Get faucet statistics
     */
    function getFaucetStats() public view returns (
        uint256 balance,
        uint256 distributed,
        uint256 claims,
        uint256 amount,
        uint256 cooldown,
        bool isPaused
    ) {
        balance = address(this).balance;
        distributed = totalDistributed;
        claims = totalClaims;
        amount = claimAmount;
        cooldown = cooldownTime;
        isPaused = paused;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Set the claim amount
     */
    function setClaimAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "AnkrFaucet: amount must be greater than 0");
        uint256 oldAmount = claimAmount;
        claimAmount = newAmount;
        emit ClaimAmountUpdated(oldAmount, newAmount);
    }
    
    /**
     * @dev Set the cooldown time
     */
    function setCooldownTime(uint256 newCooldown) external onlyOwner {
        uint256 oldCooldown = cooldownTime;
        cooldownTime = newCooldown;
        emit CooldownUpdated(oldCooldown, newCooldown);
    }
    
    /**
     * @dev Pause the faucet
     */
    function pause() external onlyOwner {
        require(!paused, "AnkrFaucet: already paused");
        paused = true;
        emit Paused(msg.sender);
    }
    
    /**
     * @dev Unpause the faucet
     */
    function unpause() external onlyOwner {
        require(paused, "AnkrFaucet: not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    /**
     * @dev Withdraw funds from the faucet
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "AnkrFaucet: insufficient balance");
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "AnkrFaucet: withdrawal failed");
        
        emit FundsWithdrawn(owner, amount);
    }
    
    /**
     * @dev Withdraw all funds from the faucet
     */
    function withdrawAll() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "AnkrFaucet: no funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "AnkrFaucet: withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "AnkrFaucet: new owner is zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    /**
     * @dev Renounce ownership
     */
    function renounceOwnership() external onlyOwner {
        address oldOwner = owner;
        owner = address(0);
        emit OwnershipTransferred(oldOwner, address(0));
    }
}
