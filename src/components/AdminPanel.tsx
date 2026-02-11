import React, { useState } from 'react';
import { Settings, Pause, Play, Download, DollarSign, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useContract } from '../hooks/useContract';

export const AdminPanel: React.FC = () => {
  const { isOwner, faucetStats, isLoading } = useStore();
  const { setClaimAmount, setCooldownTime, togglePause, withdrawFunds } = useContract();
  
  const [newClaimAmount, setNewClaimAmount] = useState(faucetStats.claimAmount);
  const [newCooldown, setNewCooldown] = useState((faucetStats.cooldownTime / 3600).toString());
  const [withdrawAmount, setWithdrawAmount] = useState('');

  if (!isOwner) return null;

  const handleSetClaimAmount = async () => {
    await setClaimAmount(newClaimAmount);
  };

  const handleSetCooldown = async () => {
    await setCooldownTime(parseInt(newCooldown));
  };

  const handleWithdraw = async () => {
    await withdrawFunds(withdrawAmount || undefined);
    setWithdrawAmount('');
  };

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Warning Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-20" />
          
          {/* Card */}
          <div className="relative glass-strong rounded-3xl p-8 border border-amber-500/30">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                <p className="text-slate-400">Manage faucet settings</p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">OWNER ONLY</span>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Claim Amount */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Claim Amount</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newClaimAmount}
                    onChange={(e) => setNewClaimAmount(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white font-mono focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="0.1"
                  />
                  <button
                    onClick={handleSetClaimAmount}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Current: {faucetStats.claimAmount} ANKR</p>
              </div>

              {/* Cooldown Time */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Cooldown (hours)</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newCooldown}
                    onChange={(e) => setNewCooldown(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white font-mono focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="12"
                  />
                  <button
                    onClick={handleSetCooldown}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Current: {faucetStats.cooldownTime / 3600} hours</p>
              </div>

              {/* Pause/Unpause */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  {faucetStats.isPaused ? (
                    <Play className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Pause className="w-5 h-5 text-amber-400" />
                  )}
                  <h3 className="font-semibold text-white">Faucet Status</h3>
                </div>
                <button
                  onClick={() => togglePause(!faucetStats.isPaused)}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                    faucetStats.isPaused
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : faucetStats.isPaused ? (
                    'Resume Faucet'
                  ) : (
                    'Pause Faucet'
                  )}
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Status: {faucetStats.isPaused ? '🔴 Paused' : '🟢 Active'}
                </p>
              </div>

              {/* Withdraw */}
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-white">Withdraw Funds</h3>
                </div>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Amount (empty = all)"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Withdraw'}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Balance: {parseFloat(faucetStats.balance).toFixed(4)} ANKR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
