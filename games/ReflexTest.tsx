
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Timer, RefreshCw } from 'lucide-react';

const ReflexTest: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    timeoutRef.current = window.setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleTrigger = () => {
    if (gameState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');
    } else if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex justify-between w-full font-mono text-xs text-slate-500 uppercase tracking-widest">
        <span>Sub-ms Tracking</span>
        <span>Target: 250ms</span>
      </div>

      <button
        onClick={handleTrigger}
        className={`w-full aspect-square rounded-[3rem] border-4 flex flex-col items-center justify-center gap-4 transition-all duration-100 active:scale-95 shadow-2xl ${
          gameState === 'idle' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' :
          gameState === 'waiting' ? 'bg-red-500/10 border-red-500/30 cursor-wait' :
          gameState === 'ready' ? 'bg-emerald-500 border-emerald-400' :
          gameState === 'early' ? 'bg-slate-900 border-red-500/50' :
          'bg-slate-900 border-indigo-500/50'
        }`}
      >
        {gameState === 'idle' && (
          <>
            <Zap size={48} className="text-slate-700" />
            <span className="text-slate-500 font-bold font-orbitron">START_TEST</span>
          </>
        )}
        {gameState === 'waiting' && (
          <>
            <Timer size={48} className="text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold font-orbitron">AWAITING_SIGNAL...</span>
          </>
        )}
        {gameState === 'ready' && (
          <>
            <Zap size={64} fill="currentColor" className="text-white animate-bounce" />
            <span className="text-white font-black font-orbitron text-2xl">ENGAGE!</span>
          </>
        )}
        {gameState === 'early' && (
          <>
            <span className="text-red-400 font-bold font-orbitron text-xl">EARLY_TRIGGER</span>
            <span className="text-slate-600 text-[10px] font-mono">SIGNAL_LOST</span>
          </>
        )}
        {gameState === 'result' && (
          <>
            <span className="text-5xl font-black font-orbitron text-white">{reactionTime}ms</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              reactionTime! < 200 ? 'text-emerald-400' : reactionTime! < 300 ? 'text-indigo-400' : 'text-slate-500'
            }`}>
              {reactionTime! < 200 ? 'PEAK_PERFORMANCE' : reactionTime! < 300 ? 'WITHIN_LIMITS' : 'LATENCY_DETECTED'}
            </span>
          </>
        )}
      </button>

      {(gameState === 'result' || gameState === 'early') && (
        <button 
          onClick={startTest}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all border border-slate-700"
        >
          <RefreshCw size={16} /> RE-INITIALIZE
        </button>
      )}

      <div className="text-[10px] text-slate-600 font-mono text-center leading-relaxed">
        Click when the module turns green as fast as you can. 
        Institutional averages: 273ms.
      </div>
    </div>
  );
};

export default ReflexTest;
