
import React from 'react';
import { Gamepad2, Globe, LayoutDashboard, Info, EyeOff, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  stealthTab: boolean;
  setStealthTab: (v: boolean) => void;
  triggerPanic: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, stealthTab, setStealthTab, triggerPanic }) => {
  const navItems = [
    { id: Page.DASHBOARD, label: 'Control', icon: LayoutDashboard },
    { id: Page.GAMES, label: 'Modules', icon: Gamepad2 },
    { id: Page.GATEWAY, label: 'Uplink', icon: Globe },
    { id: Page.ABOUT, label: 'Logs', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-slate-700">
            <Cpu className="text-slate-400" size={24} />
          </div>
          <span className="font-orbitron font-bold text-lg tracking-tighter text-slate-300">
            RESOURCE_NODE
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentPage === item.id
                  ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </a>
          ))}
          <div className="h-6 w-[1px] bg-slate-800 mx-2" />
          <button 
            onClick={() => setStealthTab(!stealthTab)}
            className={`p-2 rounded-lg transition-all ${stealthTab ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle Tab Masking"
          >
            {stealthTab ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button 
            onClick={triggerPanic}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            title="Panic Mode (ESC)"
          >
            <ShieldAlert size={20} />
          </button>
        </div>

        {/* Mobile Header Icons */}
        <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setStealthTab(!stealthTab)} className="text-slate-500">
              {stealthTab ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button onClick={triggerPanic} className="text-slate-500">
              <ShieldAlert size={18} />
            </button>
        </div>
      </div>
      
      {/* Mobile Nav Bar (Bottom) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[100] bg-slate-900/95 backdrop-blur-lg shadow-2xl border border-slate-700 rounded-2xl p-2 flex justify-around items-center">
        {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex flex-col items-center justify-center w-16 py-2 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
            </a>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
