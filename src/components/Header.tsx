import React from 'react';
import { Droplets, Wallet, ChevronDown, ExternalLink, Copy, Check, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useStore } from '../store/useStore';
import { NEURA_TESTNET } from '../config/contract';

export const Header: React.FC = () => {
  const { connect, disconnect, isConnected, isConnecting, address, balance, chainId } = useWallet();
  const { isOwner } = useStore();
  const [copied, setCopied] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const isCorrectNetwork = chainId === NEURA_TESTNET.chainId;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">ANKR Faucet</h1>
              <p className="text-xs text-slate-400">Neura Testnet</p>
            </div>
          </div>

          {/* Network & Wallet */}
          <div className="flex items-center gap-4">
            {/* Network Badge */}
            {isConnected && (
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl ${
                isCorrectNetwork 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isCorrectNetwork ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  isCorrectNetwork ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isCorrectNetwork ? 'Neura Testnet' : 'Wrong Network'}
                </span>
              </div>
            )}

            {/* Owner Badge */}
            {isOwner && isConnected && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <span className="text-xs font-semibold text-purple-400">OWNER</span>
              </div>
            )}

            {/* Wallet Button */}
            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs font-bold">{address?.slice(2, 4).toUpperCase()}</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-white font-mono">{formatAddress(address!)}</p>
                    <p className="text-xs text-slate-400">{parseFloat(balance).toFixed(4)} ANKR</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl glass-strong border border-slate-700 overflow-hidden animate-fade-in-up">
                    <div className="p-4 border-b border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Connected Wallet</p>
                      <p className="font-mono text-sm text-white">{formatAddress(address!)}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-300">{copied ? 'Copied!' : 'Copy Address'}</span>
                      </button>
                      <a
                        href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">View on Explorer</span>
                      </a>
                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
