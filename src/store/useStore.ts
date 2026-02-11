import { create } from 'zustand';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string;
}

interface FaucetStats {
  balance: string;
  totalDistributed: string;
  totalClaims: number;
  claimAmount: string;
  cooldownTime: number;
  isPaused: boolean;
}

interface UserStats {
  claims: number;
  received: string;
  lastClaim: number;
  nextClaim: number;
  eligible: boolean;
  remainingCooldown: number;
}

interface AppState {
  wallet: WalletState;
  faucetStats: FaucetStats;
  userStats: UserStats;
  isOwner: boolean;
  isLoading: boolean;
  isClaiming: boolean;
  error: string | null;
  txHash: string | null;
  
  setWallet: (wallet: Partial<WalletState>) => void;
  setFaucetStats: (stats: Partial<FaucetStats>) => void;
  setUserStats: (stats: Partial<UserStats>) => void;
  setIsOwner: (isOwner: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsClaiming: (isClaiming: boolean) => void;
  setError: (error: string | null) => void;
  setTxHash: (txHash: string | null) => void;
  resetState: () => void;
}

const initialWalletState: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  balance: '0',
};

const initialFaucetStats: FaucetStats = {
  balance: '0',
  totalDistributed: '0',
  totalClaims: 0,
  claimAmount: '0.1',
  cooldownTime: 43200,
  isPaused: false,
};

const initialUserStats: UserStats = {
  claims: 0,
  received: '0',
  lastClaim: 0,
  nextClaim: 0,
  eligible: true,
  remainingCooldown: 0,
};

export const useStore = create<AppState>((set) => ({
  wallet: initialWalletState,
  faucetStats: initialFaucetStats,
  userStats: initialUserStats,
  isOwner: false,
  isLoading: false,
  isClaiming: false,
  error: null,
  txHash: null,
  
  setWallet: (wallet) => set((state) => ({ 
    wallet: { ...state.wallet, ...wallet } 
  })),
  
  setFaucetStats: (stats) => set((state) => ({ 
    faucetStats: { ...state.faucetStats, ...stats } 
  })),
  
  setUserStats: (stats) => set((state) => ({ 
    userStats: { ...state.userStats, ...stats } 
  })),
  
  setIsOwner: (isOwner) => set({ isOwner }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsClaiming: (isClaiming) => set({ isClaiming }),
  setError: (error) => set({ error }),
  setTxHash: (txHash) => set({ txHash }),
  
  resetState: () => set({
    wallet: initialWalletState,
    faucetStats: initialFaucetStats,
    userStats: initialUserStats,
    isOwner: false,
    isLoading: false,
    isClaiming: false,
    error: null,
    txHash: null,
  }),
}));
