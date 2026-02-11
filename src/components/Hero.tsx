import React from 'react';
import { Droplets, Sparkles, Zap, Shield } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hex-pattern" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating Elements */}
      <div className="absolute top-40 left-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-60 right-20 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-1/4 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Powered by Neura Network</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">Get Free </span>
            <span className="gradient-text">ANKR</span>
            <br />
            <span className="text-white">Testnet Tokens</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Claim your free ANKR tokens to start building and testing on the Neura Testnet. 
            Fast, secure, and completely free.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">0.1 ANKR per claim</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-300">Instant delivery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-300">12h cooldown</span>
            </div>
          </div>
        </div>

        {/* Animated Token */}
        <div className="relative mt-16 flex justify-center">
          <div className="relative">
            {/* Glow Ring */}
            <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
            
            {/* Token */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-1 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-black gradient-text">A</span>
                  <p className="text-xs text-slate-400 mt-1">ANKR</p>
                </div>
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
