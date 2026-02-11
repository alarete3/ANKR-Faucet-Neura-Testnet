# ANKR Faucet - Neura Testnet

A production-ready Web3 faucet dApp for claiming free ANKR tokens on the Neura Testnet.

![ANKR Faucet](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop)

## 🚀 Features

- **Claim ANKR Tokens**: Get 0.1 ANKR per claim for testing
- **12-Hour Cooldown**: Rate limiting to prevent abuse
- **Real-time Stats**: View faucet balance and total distributions
- **Admin Panel**: Owner can manage faucet settings
- **Beautiful UI**: Modern dark theme with glass morphism effects
- **Fully Responsive**: Works on all devices

## 📋 Smart Contract

The smart contract is located at `contracts/AnkrFaucet.sol` and includes:

- Faucet functionality with configurable claim amounts
- Rate limiting with cooldown periods
- Claim registry tracking all distributions
- Admin controls (pause, withdraw, configure)
- Built-in security (reentrancy protection, ownership)

### Contract Address

**Neura Testnet**: `0x0000000000000000000000000000000000000000`

> ⚠️ Deploy the contract and update `src/config/contract.ts` with the actual address

## 🛠️ Deployment Instructions

### 1. Deploy Smart Contract

Using Remix IDE:
1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create new file `AnkrFaucet.sol`
3. Copy contract code from `contracts/AnkrFaucet.sol`
4. Compile with Solidity 0.8.19+
5. Connect MetaMask to Neura Testnet
6. Deploy contract
7. Fund the contract with ANKR tokens

### 2. Configure Frontend

Update `src/config/contract.ts`:
```typescript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. Run Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Network Configuration

**Neura Testnet**
- Chain ID: 267 (0x10B)
- RPC URL: https://rpc.ankr.com/neura_testnet
- Explorer: https://explorer.neura.network
- Currency: ANKR

## 📁 Project Structure

```
├── contracts/
│   └── AnkrFaucet.sol      # Smart contract (single file)
├── src/
│   ├── components/         # React components
│   ├── config/            # Contract configuration
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   └── App.tsx            # Main application
├── public/                # Static assets
└── README.md             # This file
```

## 🔐 Admin Functions

Only the contract owner can:
- Set claim amount
- Set cooldown time
- Pause/unpause faucet
- Withdraw funds
- Transfer ownership

## 📜 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ for the Neura community
