import React from 'react';
import { Droplets, Users, Coins, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Stats: React.FC = () => {
  const { faucetStats } = useStore();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours`;
  };

  const stats = [
    {
      icon: Coins,
      label: 'Faucet Balance',
      value: `${parseFloat(faucetStats.balance).toFixed(2)} ANKR`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Droplets,
      label: 'Total Distributed',
      value: `${parseFloat(faucetStats.totalDistributed).toFixed(2)} ANKR`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: Users,
      label: 'Total Claims',
      value: formatNumber(faucetStats.totalClaims),
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      icon: Clock,
      label: 'Cooldown Period',
      value: formatCooldown(faucetStats.cooldownTime),
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Faucet Statistics</h2>
          <p className="text-slate-400">Real-time metrics from the ANKR Faucet</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`relative glass rounded-2xl p-6 card-hover animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${stat.bgColor} border ${stat.borderColor} mb-4`}>
                <stat.icon className={`w-7 h-7 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                <stat.icon className={`w-7 h-7 absolute`} style={{ 
                  background: `linear-gradient(135deg, ${stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('purple') ? '#8B5CF6' : stat.color.includes('emerald') ? '#10B981' : '#F59E0B'}, ${stat.color.includes('cyan') ? '#06B6D4' : stat.color.includes('pink') ? '#EC4899' : stat.color.includes('teal') ? '#14B8A6' : '#F97316'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }} />
              </div>

              {/* Content */}
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>

              {/* Decorative gradient line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${stat.color} opacity-50`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
