
import React, { useState } from 'react';
import { Search, Play, X, RotateCcw, Maximize2, Trophy, Flame, Brain, Target } from 'lucide-react';
import SnakeGame from '../games/SnakeGame';
import Puzzle2048 from '../games/Puzzle2048';
import MemoryMatch from '../games/MemoryMatch';
import ClickerHero from '../games/ClickerHero';
import TicTacToe from '../games/TicTacToe';
import VoidSweeper from '../games/VoidSweeper';
import ReflexTest from '../games/ReflexTest';

interface Game {
  id: string;
  name: string;
  category: 'Arcade' | 'Puzzle' | 'Logic' | 'Brain' | 'Idle' | 'Classic';
  image: string;
  component: React.FC;
  rating: number;
}

const GAMES: Game[] = [
  { id: 'snake', name: 'Neon Snake', category: 'Arcade', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', component: SnakeGame, rating: 4.8 },
  { id: '2048', name: '2048 Fusion', category: 'Puzzle', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', component: Puzzle2048, rating: 4.9 },
  { id: 'memory', name: 'Neural Match', category: 'Brain', image: 'https://images.unsplash.com/photo-1606326666490-4175911ef62f?w=400&h=300&fit=crop', component: MemoryMatch, rating: 4.5 },
  { id: 'clicker', name: 'Core Clicker', category: 'Idle', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', component: ClickerHero, rating: 4.2 },
  { id: 'tictactoe', name: 'Quantum TicTacToe', category: 'Classic', image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop', component: TicTacToe, rating: 4.4 },
  { id: 'mines', name: 'Void Sweeper', category: 'Logic', image: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=400&h=300&fit=crop', component: VoidSweeper, rating: 4.6 },
  { id: 'reaction', name: 'Reflex Test', category: 'Arcade', image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop', component: ReflexTest, rating: 4.3 },
  { id: 'tetris', name: 'Tetra Fall', category: 'Puzzle', image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=300&fit=crop', component: () => <div className="p-12 text-center text-slate-500 font-mono uppercase tracking-widest">Compiling_Assets...</div>, rating: 4.7 },
  { id: 'typing', name: 'Ghost Typer', category: 'Classic', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83bac1?w=400&h=300&fit=crop', component: () => <div className="p-12 text-center text-slate-500 font-mono uppercase tracking-widest">Awaiting_Dictionary...</div>, rating: 4.1 },
  { id: 'sudoku', name: 'Logic Grid', category: 'Logic', image: 'https://images.unsplash.com/photo-1509228468518-180dd4821805?w=400&h=300&fit=crop', component: () => <div className="p-12 text-center text-slate-500 font-mono uppercase tracking-widest">Calculating_Grids...</div>, rating: 4.5 },
  { id: 'binary', name: 'Binary Guess', category: 'Brain', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', component: () => <div className="p-12 text-center text-slate-500 font-mono uppercase tracking-widest">Loading_Core...</div>, rating: 3.9 },
  { id: 'tower', name: 'Stack Relay', category: 'Arcade', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', component: () => <div className="p-12 text-center text-slate-500 font-mono uppercase tracking-widest">Building_Blocks...</div>, rating: 4.4 },
];

const GamesList: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Arcade', 'Puzzle', 'Logic', 'Brain', 'Idle', 'Classic'];

  const filteredGames = GAMES.filter(g => 
    (selectedCategory === 'All' || g.category === selectedCategory) &&
    (g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     g.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-orbitron font-bold text-slate-200">System Modules</h2>
          <p className="text-slate-500">Local resource execution. No external telemetry.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Search modules..."
              className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-slate-700 transition-all font-mono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === cat 
                    ? 'bg-slate-800 text-slate-100 border-slate-700' 
                    : 'bg-slate-950 text-slate-600 border-slate-900 hover:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col shadow-lg"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={game.image} alt={game.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <button 
                  onClick={() => setActiveGame(game)}
                  className="bg-slate-100 text-slate-950 p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300"
                >
                  <Play size={24} fill="currentColor" />
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-800 text-slate-400">
                {game.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-bold text-yellow-500/80 flex items-center gap-1 border border-slate-800">
                <Trophy size={10} /> {game.rating}
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 backdrop-blur flex justify-between items-center border-t border-slate-800/50">
              <h3 className="font-orbitron font-bold text-sm tracking-wide text-slate-300 group-hover:text-white transition-colors">{game.name}</h3>
              <button 
                onClick={() => setActiveGame(game)}
                className="text-slate-600 hover:text-white transition-colors"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredGames.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-800">
                <Search size={32} />
            </div>
            <p className="text-slate-600 font-mono text-sm">NO_MATCHES_FOUND</p>
          </div>
        )}
      </div>

      {activeGame && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-full">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-700">
                  <Play size={20} fill="currentColor" className="text-slate-300" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-lg leading-none text-slate-100">{activeGame.name}</h2>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeGame.category} // RUNTIME: OK</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                  onClick={() => {
                    const game = activeGame;
                    setActiveGame(null);
                    setTimeout(() => setActiveGame(game), 10);
                  }}
                  title="Reload"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"
                  onClick={() => setActiveGame(null)}
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center p-6 overflow-auto bg-slate-950/50">
              <activeGame.component />
            </div>
            <div className="p-3 bg-slate-900 text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] border-t border-slate-800">
              LOCAL_EXECUTION_MODE • ENCRYPTED_SCORE_BUFFER
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesList;
