import React, { useEffect, useState } from 'react';
import { Droplets, Clock, CheckCircle, AlertCircle, ExternalLink, Loader2, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { NEURA_TESTNET } from '../config/contract';

export const FaucetCard: React.FC = () => {
  const { wallet, userStats, faucetStats, isClaiming, error, txHash } = useStore();
  const { connect, isConnecting } = useWallet();
  const { claim } = useContract();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (userStats.remainingCooldown > 0) {
      const interval = setInterval(() => {
        const hours = Math.floor(userStats.remainingCooldown / 3600);
        const minutes = Math.floor((userStats.remainingCooldown % 3600) / 60);
        const seconds = userStats.remainingCooldown % 60;
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown('');
    }
  }, [userStats.remainingCooldown]);

  const canClaim = wallet.isConnected && userStats.eligible && !faucetStats.isPaused;

  return (
    <section className="relative py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-gradient" />
          
          {/* Card */}
          <div className="relative glass-strong rounded-3xl p-8 card-hover">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 animate-pulse-glow">
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Claim ANKR Tokens</h2>
              <p className="text-slate-400">Get {faucetStats.claimAmount} ANKR for testing</p>
            </div>

            {/* Status */}
            {wallet.isConnected && (
              <div className="mb-6">
                {faucetStats.isPaused ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-medium">Faucet is currently paused</span>
                  </div>
                ) : userStats.eligible ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">You are eligible to claim!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-slate-600">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <span className="text-slate-300 font-medium">Next claim available in</span>
                      <p className="text-2xl font-mono font-bold text-white mt-1">{countdown}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Claim Button */}
            {!wallet.isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-6 h-6" />
                    <span>Connect Wallet to Claim</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={claim}
                disabled={!canClaim || isClaiming}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  canClaim && !isClaiming
                    ? 'btn-primary'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <Droplets className="w-6 h-6" />
                    <span>Claim {faucetStats.claimAmount} ANKR</span>
                  </>
                )}
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {txHash && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-400 font-medium mb-2">🎉 Claim successful!</p>
                <a
                  href={`${NEURA_TESTNET.blockExplorerUrls[0]}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* User Stats */}
            {wallet.isConnected && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Your Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Total Claims</p>
                    <p className="text-xl font-bold text-white">{userStats.claims}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Total Received</p>
                    <p className="text-xl font-bold text-white">{parseFloat(userStats.received).toFixed(2)} ANKR</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
