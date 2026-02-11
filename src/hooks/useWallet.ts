import { useCallback, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { useStore } from '../store/useStore';
import { NEURA_TESTNET } from '../config/contract';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export const useWallet = () => {
  const { wallet, setWallet, setError, resetState } = useStore();

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId as string, 16) === NEURA_TESTNET.chainId;
    } catch {
      return false;
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NEURA_TESTNET.chainIdHex }],
      });
      return true;
    } catch (switchError: unknown) {
      const error = switchError as { code: number };
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: NEURA_TESTNET.chainIdHex,
              chainName: NEURA_TESTNET.chainName,
              nativeCurrency: NEURA_TESTNET.nativeCurrency,
              rpcUrls: NEURA_TESTNET.rpcUrls,
              blockExplorerUrls: NEURA_TESTNET.blockExplorerUrls,
            }],
          });
          return true;
        } catch {
          setError('Failed to add Neura Testnet');
          return false;
        }
      }
      setError('Failed to switch network');
      return false;
    }
  }, [setError]);

  const getBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return '0';
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch {
      return '0';
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to use this dApp');
      return;
    }

    setWallet({ isConnecting: true });
    setError(null);

    try {
      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
        const switched = await switchNetwork();
        if (!switched) {
          setWallet({ isConnecting: false });
          return;
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        const address = accounts[0];
        const balance = await getBalance(address);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWallet({
          address,
          isConnected: true,
          isConnecting: false,
          chainId: parseInt(chainId as string, 16),
          balance,
        });
      }
    } catch (err: unknown) {
      const error = err as { code: number; message: string };
      if (error.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet');
      }
      setWallet({ isConnecting: false });
    }
  }, [checkNetwork, switchNetwork, getBalance, setWallet, setError]);

  const disconnect = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleAccountsChanged = useCallback(async (accounts: unknown) => {
    const accountList = accounts as string[];
    if (accountList.length === 0) {
      disconnect();
    } else {
      const address = accountList[0];
      const balance = await getBalance(address);
      setWallet({ address, balance });
    }
  }, [disconnect, getBalance, setWallet]);

  const handleChainChanged = useCallback((chainId: unknown) => {
    const newChainId = parseInt(chainId as string, 16);
    setWallet({ chainId: newChainId });
    
    if (newChainId !== NEURA_TESTNET.chainId) {
      setError('Please switch to Neura Testnet');
    } else {
      setError(null);
    }
  }, [setWallet, setError]);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
      const accountList = accounts as string[];
      if (accountList.length > 0) {
        const address = accountList[0];
        const balance = await getBalance(address);
        const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
        
        setWallet({
          address,
          isConnected: true,
          chainId: parseInt(chainId as string, 16),
          balance,
        });
      }
    });

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, getBalance, setWallet]);

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
    checkNetwork,
    refreshBalance: () => wallet.address && getBalance(wallet.address).then(balance => setWallet({ balance })),
  };
};
