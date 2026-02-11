import { useCallback, useEffect, useRef } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { useStore } from '../store/useStore';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export const useContract = () => {
  const { 
    wallet, 
    setFaucetStats, 
    setUserStats, 
    setIsOwner, 
    setIsLoading, 
    setIsClaiming,
    setError, 
    setTxHash 
  } = useStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getContract = useCallback(async (withSigner = false) => {
    if (!window.ethereum) throw new Error('No wallet found');
    
    const provider = new BrowserProvider(window.ethereum);
    
    if (withSigner) {
      const signer = await provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, []);

  const fetchFaucetStats = useCallback(async () => {
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // Mock data for demo
      setFaucetStats({
        balance: '100.0',
        totalDistributed: '1250.5',
        totalClaims: 12505,
        claimAmount: '0.1',
        cooldownTime: 43200,
        isPaused: false,
      });
      return;
    }

    try {
      const contract = await getContract();
      const stats = await contract.getFaucetStats();
      
      setFaucetStats({
        balance: formatEther(stats.balance),
        totalDistributed: formatEther(stats.distributed),
        totalClaims: Number(stats.claims),
        claimAmount: formatEther(stats.amount),
        cooldownTime: Number(stats.cooldown),
        isPaused: stats.isPaused,
      });
    } catch (err) {
      console.error('Failed to fetch faucet stats:', err);
    }
  }, [getContract, setFaucetStats]);

  const fetchUserStats = useCallback(async () => {
    if (!wallet.address) return;
    
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // Mock data for demo
      const mockEligible = Math.random() > 0.3;
      const mockCooldown = mockEligible ? 0 : Math.floor(Math.random() * 43200);
      
      setUserStats({
        claims: Math.floor(Math.random() * 10),
        received: (Math.random() * 2).toFixed(2),
        lastClaim: mockEligible ? 0 : Date.now() / 1000 - (43200 - mockCooldown),
        nextClaim: mockEligible ? Date.now() / 1000 : Date.now() / 1000 + mockCooldown,
        eligible: mockEligible,
        remainingCooldown: mockCooldown,
      });
      return;
    }

    try {
      const contract = await getContract();
      const stats = await contract.getUserStats(wallet.address);
      const remainingCooldown = await contract.getRemainingCooldown(wallet.address);
      
      setUserStats({
        claims: Number(stats.claims),
        received: formatEther(stats.received),
        lastClaim: Number(stats.lastClaim),
        nextClaim: Number(stats.nextClaim),
        eligible: stats.eligible,
        remainingCooldown: Number(remainingCooldown),
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  }, [wallet.address, getContract, setUserStats]);

  const checkOwnership = useCallback(async () => {
    if (!wallet.address) {
      setIsOwner(false);
      return;
    }
    
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // Mock: first connected wallet is owner for demo
      setIsOwner(true);
      return;
    }

    try {
      const contract = await getContract();
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === wallet.address.toLowerCase());
    } catch (err) {
      console.error('Failed to check ownership:', err);
      setIsOwner(false);
    }
  }, [wallet.address, getContract, setIsOwner]);

  const claim = useCallback(async () => {
    if (!wallet.address) {
      setError('Please connect your wallet');
      return;
    }

    setIsClaiming(true);
    setError(null);
    setTxHash(null);

    try {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // Mock transaction for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTxHash('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
        await fetchFaucetStats();
        await fetchUserStats();
        setIsClaiming(false);
        return;
      }

      const contract = await getContract(true);
      const tx = await contract.claim();
      setTxHash(tx.hash);
      
      await tx.wait();
      
      await fetchFaucetStats();
      await fetchUserStats();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || 'Transaction failed');
    } finally {
      setIsClaiming(false);
    }
  }, [wallet.address, getContract, setIsClaiming, setError, setTxHash, fetchFaucetStats, fetchUserStats]);

  // Admin functions
  const setClaimAmount = useCallback(async (amount: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFaucetStats({ claimAmount: amount });
        setIsLoading(false);
        return;
      }

      const contract = await getContract(true);
      const tx = await contract.setClaimAmount(parseEther(amount));
      await tx.wait();
      await fetchFaucetStats();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || 'Failed to update claim amount');
    } finally {
      setIsLoading(false);
    }
  }, [getContract, setIsLoading, setError, setFaucetStats, fetchFaucetStats]);

  const setCooldownTime = useCallback(async (hours: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFaucetStats({ cooldownTime: hours * 3600 });
        setIsLoading(false);
        return;
      }

      const contract = await getContract(true);
      const tx = await contract.setCooldownTime(hours * 3600);
      await tx.wait();
      await fetchFaucetStats();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || 'Failed to update cooldown');
    } finally {
      setIsLoading(false);
    }
  }, [getContract, setIsLoading, setError, setFaucetStats, fetchFaucetStats]);

  const togglePause = useCallback(async (pause: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFaucetStats({ isPaused: pause });
        setIsLoading(false);
        return;
      }

      const contract = await getContract(true);
      const tx = pause ? await contract.pause() : await contract.unpause();
      await tx.wait();
      await fetchFaucetStats();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || 'Failed to toggle pause');
    } finally {
      setIsLoading(false);
    }
  }, [getContract, setIsLoading, setError, setFaucetStats, fetchFaucetStats]);

  const withdrawFunds = useCallback(async (amount?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        return;
      }

      const contract = await getContract(true);
      const tx = amount 
        ? await contract.withdraw(parseEther(amount))
        : await contract.withdrawAll();
      await tx.wait();
      await fetchFaucetStats();
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      setError(error.reason || error.message || 'Failed to withdraw');
    } finally {
      setIsLoading(false);
    }
  }, [getContract, setIsLoading, setError, fetchFaucetStats]);

  // Auto-refresh cooldown
  useEffect(() => {
    if (wallet.isConnected) {
      fetchFaucetStats();
      fetchUserStats();
      checkOwnership();

      intervalRef.current = setInterval(() => {
        fetchUserStats();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [wallet.isConnected, wallet.address, fetchFaucetStats, fetchUserStats, checkOwnership]);

  return {
    claim,
    setClaimAmount,
    setCooldownTime,
    togglePause,
    withdrawFunds,
    fetchFaucetStats,
    fetchUserStats,
  };
};
