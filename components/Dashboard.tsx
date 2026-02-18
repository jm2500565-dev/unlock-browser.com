
import React from 'react';
import { Play, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { Page } from '../App';

interface DashboardProps {
  setPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  return (
    <div className="space-y-12 pb-24 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-16 flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold tracking-widest uppercase border border-indigo-500/20">
            <Zap size={14} /> Ultimate Gaming Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-orbitron font-extrabold tracking-tight leading-tight">
            Play Hard. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Access Insight.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            High-performance browser games and a proprietary neural gateway for unrestricted information retrieval.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setPage(Page.GAMES)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              <Play size={20} fill="currentColor" /> Play Now
            </button>
            <button 
              onClick={() => setPage(Page.GATEWAY)}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Globe size={20} /> Open Gateway
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Play, title: "Instant Play", desc: "No downloads required. Optimized for school and work browsers." },
          { icon: Shield, title: "Zero Logging", desc: "We use ephemeral sessions. Your history is never stored on our servers." },
          { icon: Globe, title: "Neural Gateway", desc: "Bypass static filters with advanced packet-level web retrieval." }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
              <feat.icon className="text-indigo-400" size={24} />
            </div>
            <h3 className="font-orbitron font-bold text-lg mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-400">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Games Preview */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-orbitron font-bold">Featured Classics</h2>
            <p className="text-slate-400">Hand-picked favorites for your break time.</p>
          </div>
          <button 
            onClick={() => setPage(Page.GAMES)}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group"
          >
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Neon Snake", category: "Arcade", img: "https://picsum.photos/400/300?random=1", rating: 4.8 },
            { name: "2048 Fusion", category: "Puzzle", img: "https://picsum.photos/400/300?random=2", rating: 4.9 },
            { name: "Pixel Platformer", category: "Action", img: "https://picsum.photos/400/300?random=3", rating: 4.7 },
            { name: "Space Invaders X", category: "Retro", img: "https://picsum.photos/400/300?random=4", rating: 4.5 }
          ].map((game, i) => (
            <div key={i} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 cursor-pointer" onClick={() => setPage(Page.GAMES)}>
              <div className="h-40 overflow-hidden relative">
                <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" /> {game.rating}
                </div>
              </div>
              <div className="p-4">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{game.category}</span>
                <h4 className="font-bold text-lg mt-1 group-hover:text-indigo-400 transition-colors">{game.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
