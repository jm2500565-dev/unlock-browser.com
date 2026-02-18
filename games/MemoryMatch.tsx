
import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

const ICONS = ['🔥', '⚡', '🌌', '⚛️', '🛰️', '💾', '🧩', '🧪'];

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleFlip = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(m => m + 1);
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex justify-between w-full font-mono text-xs text-slate-500 uppercase tracking-widest">
        <span>Moves: {moves}</span>
        <span>Matches: {matches}/8</span>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full aspect-square">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`relative w-full h-full rounded-xl transition-all duration-500 transform preserve-3d ${
              card.flipped || card.matched ? 'rotate-y-180' : ''
            }`}
          >
            <div className={`absolute inset-0 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center backface-hidden ${card.flipped || card.matched ? 'opacity-0' : 'opacity-100'}`}>
              <Brain size={20} className="text-slate-600" />
            </div>
            <div className={`absolute inset-0 bg-slate-100 rounded-xl flex items-center justify-center rotate-y-180 backface-hidden ${card.flipped || card.matched ? 'opacity-100' : 'opacity-0'} ${card.matched ? 'bg-emerald-500/20 border-emerald-500/50 border' : ''}`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </button>
        ))}
      </div>

      {matches === 8 && (
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-top-4">
          <p className="text-emerald-400 font-bold font-orbitron">SYSTEM_RESTORED</p>
          <button onClick={initGame} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-100 rounded-lg text-xs font-bold hover:bg-slate-700">
            <RefreshCw size={14} /> REBOOT
          </button>
        </div>
      )}

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryMatch;
