// Contract configuration for ANKR Faucet on Neura Testnet

export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Deploy and update this

export const NEURA_TESTNET = {
  chainId: 267,
  chainIdHex: "0x10B",
  chainName: "Neura Testnet",
  nativeCurrency: {
    name: "ANKR",
    symbol: "ANKR",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/neura_testnet"],
  blockExplorerUrls: ["https://explorer.neura.network"],
};

export const CONTRACT_ABI = [
  // Read functions
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function claimAmount() view returns (uint256)",
  "function cooldownTime() view returns (uint256)",
  "function totalDistributed() view returns (uint256)",
  "function totalClaims() view returns (uint256)",
  "function lastClaimTime(address) view returns (uint256)",
  "function totalClaimsPerUser(address) view returns (uint256)",
  "function totalReceivedPerUser(address) view returns (uint256)",
  "function canClaim(address user) view returns (bool)",
  "function getRemainingCooldown(address user) view returns (uint256)",
  "function getNextClaimTime(address user) view returns (uint256)",
  "function getFaucetBalance() view returns (uint256)",
  "function getUserStats(address user) view returns (uint256 claims, uint256 received, uint256 lastClaim, uint256 nextClaim, bool eligible)",
  "function getFaucetStats() view returns (uint256 balance, uint256 distributed, uint256 claims, uint256 amount, uint256 cooldown, bool isPaused)",
  
  // Write functions
  "function claim()",
  "function setClaimAmount(uint256 newAmount)",
  "function setCooldownTime(uint256 newCooldown)",
  "function pause()",
  "function unpause()",
  "function withdraw(uint256 amount)",
  "function withdrawAll()",
  "function transferOwnership(address newOwner)",
  
  // Events
  "event Claimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event ClaimAmountUpdated(uint256 oldAmount, uint256 newAmount)",
  "event CooldownUpdated(uint256 oldCooldown, uint256 newCooldown)",
  "event Paused(address indexed by)",
  "event Unpaused(address indexed by)",
  "event FundsWithdrawn(address indexed to, uint256 amount)",
  "event FundsDeposited(address indexed from, uint256 amount)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
];
