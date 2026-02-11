import React from 'react';
import { Droplets, Github, Twitter, Globe, Heart } from 'lucide-react';
import { NEURA_TESTNET, CONTRACT_ADDRESS } from '../config/contract';

export const Footer: React.FC = () => {
  return (
    <footer className="relative py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ANKR Faucet</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Free ANKR testnet tokens for developers building on Neura Network. 
              Fast, reliable, and always available.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-slate-400" />
              </a>
              <a
                href="https://neura.network"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Globe className="w-5 h-5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://docs.ankr.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href={NEURA_TESTNET.blockExplorerUrls[0]} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Block Explorer
                </a>
              </li>
              <li>
                <a href="https://neura.network" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  Neura Network
                </a>
              </li>
            </ul>
          </div>

          {/* Contract Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contract</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Network</p>
                <p className="text-sm text-slate-300">{NEURA_TESTNET.chainName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Chain ID</p>
                <p className="text-sm text-slate-300 font-mono">{NEURA_TESTNET.chainId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Contract Address</p>
                <a
                  href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 font-mono break-all transition-colors"
                >
                  {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2025 ANKR Faucet. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500" /> for the Neura community
          </p>
        </div>
      </div>
    </footer>
  );
};
