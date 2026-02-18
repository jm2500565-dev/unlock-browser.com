
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Database, Terminal } from 'lucide-react';

const ClickerHero: React.FC = () => {
  const [data, setData] = useState(0);
  const [dps, setDps] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Cache Buffer', cost: 15, dps: 1, count: 0 },
    { id: 2, name: 'Node Processor', cost: 100, dps: 5, count: 0 },
    { id: 3, name: 'Server Rack', cost: 500, dps: 20, count: 0 },
    { id: 4, name: 'Quantum Core', cost: 2000, dps: 100, count: 0 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => prev + dps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [dps]);

  const handleUpgrade = (id: number) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || data < upgrade.cost) return;

    setData(prev => prev - upgrade.cost);
    setDps(prev => prev + upgrade.dps);
    setUpgrades(prev => prev.map(u => 
      u.id === id ? { ...u, count: u.count + 1, cost: Math.floor(u.cost * 1.15) } : u
    ));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 w-full text-center space-y-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Data Harvested</span>
          <span className="text-4xl font-orbitron font-bold text-indigo-400">{Math.floor(data)} MB</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">UPLINK_SPEED: {dps.toFixed(1)} MB/s</div>
        
        <button 
          onClick={() => setData(d => d + clickPower)}
          className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-all shadow-xl hover:border-indigo-500 group"
        >
          <Database size={48} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </button>
      </div>

      <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
        {upgrades.map(u => (
          <button
            key={u.id}
            onClick={() => handleUpgrade(u.id)}
            disabled={data < u.cost}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              data >= u.cost 
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                : 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-300">{u.name}</span>
              <span className="text-[10px] text-slate-500">Lv. {u.count} • +{u.dps} MB/s</span>
            </div>
            <div className="text-xs font-mono font-bold text-indigo-400">{u.cost} MB</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClickerHero;
