import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FaucetCard } from './components/FaucetCard';
import { Stats } from './components/Stats';
import { HowItWorks } from './components/HowItWorks';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative noise-overlay">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <FaucetCard />
          <Stats />
          <HowItWorks />
          <AdminPanel />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
