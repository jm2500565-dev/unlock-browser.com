
import React, { useState, useEffect } from 'react';
import { X, Circle, RefreshCw } from 'lucide-react';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'Draw';
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
      if (emptyIndices.length > 0) {
        setTimeout(() => {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }, 500);
      }
    }
  }, [isXNext, winner, board]);

  useEffect(() => {
    setWinner(calculateWinner(board));
  }, [board]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="font-orbitron font-bold text-sm text-slate-400 uppercase tracking-widest">
        {winner ? (winner === 'Draw' ? 'Equilibrium' : `Winner: ${winner}`) : `Turn: ${isXNext ? 'YOU' : 'NODE'}`}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full aspect-square">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!isXNext || !!val || !!winner}
            className={`bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-all hover:bg-slate-800 ${!val && !winner ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {val === 'X' && <X size={40} className="text-indigo-400" />}
            {val === 'O' && <Circle size={40} className="text-pink-400" />}
          </button>
        ))}
      </div>

      {(winner || !board.includes(null)) && (
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <RefreshCw size={16} /> RE-INITIALIZE
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
