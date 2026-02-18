
import React, { useState, useEffect } from 'react';
import { Gamepad2, Globe, LayoutDashboard, Info, Github, ShieldAlert, MonitorCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GamesList from './components/GamesList';
import Gateway from './components/Gateway';
import About from './components/About';

export enum Page {
  DASHBOARD = 'dashboard',
  GAMES = 'games',
  GATEWAY = 'gateway',
  ABOUT = 'about'
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isPanic, setIsPanic] = useState(false);
  const [stealthTab, setStealthTab] = useState(false);

  // Handle Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (Object.values(Page).includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Panic Button / Tab Masking logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPanic(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (stealthTab || isPanic) {
      document.title = isPanic ? "System Diagnostic [Active]" : "Research Project - Loading...";
    } else {
      document.title = "Local Resource Node";
    }
  }, [stealthTab, isPanic]);

  const renderContent = () => {
    if (isPanic) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-pulse">
          <MonitorCheck size={64} className="text-slate-700" />
          <div className="text-center space-y-2">
            <h1 className="text-xl font-mono text-slate-500">System Update in Progress...</h1>
            <p className="text-sm font-mono text-slate-600 italic">Do not close this window. Checking local cache integrity (84%)</p>
          </div>
          <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-slate-700 w-3/4"></div>
          </div>
          <button 
            onClick={() => setIsPanic(false)} 
            className="text-[10px] text-slate-800 hover:text-slate-700 font-mono pt-20"
          >
            Press ESC to return
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard setPage={setCurrentPage} />;
      case Page.GAMES:
        return <GamesList />;
      case Page.GATEWAY:
        return <Gateway />;
      case Page.ABOUT:
        return <About />;
      default:
        return <Dashboard setPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`min-h-screen ${isPanic ? 'bg-black' : 'bg-slate-950'} text-slate-100 flex flex-col transition-colors duration-200`}>
      {!isPanic && (
        <Navbar 
          currentPage={currentPage} 
          stealthTab={stealthTab} 
          setStealthTab={setStealthTab} 
          triggerPanic={() => setIsPanic(true)}
        />
      )}
      
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>

      {!isPanic && (
        <footer className="border-t border-slate-800 bg-slate-900/50 py-6 mt-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-white font-orbitron">R</div>
              <span className="text-slate-500 text-sm">© 2024 Research Node. Network Integrity Confirmed.</span>
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Usage Logs</a>
              <button onClick={() => setIsPanic(true)} className="flex items-center gap-1 hover:text-red-400 transition-colors">
                <ShieldAlert size={14} /> Panic (ESC)
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
