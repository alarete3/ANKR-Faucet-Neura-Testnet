import React from 'react';
import { Wallet, MousePointer, Droplets, Rocket } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Connect your MetaMask or compatible Web3 wallet to the Neura Testnet.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MousePointer,
      title: 'Click Claim',
      description: 'Press the claim button to request your free ANKR testnet tokens.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Droplets,
      title: 'Receive Tokens',
      description: 'Tokens are instantly sent to your wallet address on Neura Testnet.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Rocket,
      title: 'Start Building',
      description: 'Use your tokens to deploy contracts and test your dApps.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hex-pattern opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get started with ANKR testnet tokens in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-slate-600 to-transparent z-0" />
              )}

              {/* Card */}
              <div className="relative glass rounded-2xl p-6 card-hover h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
