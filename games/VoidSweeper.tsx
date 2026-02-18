
import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag, RefreshCw } from 'lucide-react';

const SIZE = 10;
const MINES_COUNT = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const VoidSweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const createGrid = useCallback(() => {
    let newGrid: Cell[][] = Array(SIZE).fill(null).map(() => 
      Array(SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Plant mines
    let planted = 0;
    while (planted < MINES_COUNT) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        planted++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    setGrid(newGrid);
    setStatus('playing');
  }, []);

  useEffect(() => {
    createGrid();
  }, [createGrid]);

  const revealCell = (r: number, c: number) => {
    if (status !== 'playing' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      // Game Over
      newGrid[r][c].isRevealed = true;
      setGrid(newGrid);
      setStatus('lost');
      return;
    }

    const floodFill = (row: number, col: number) => {
      if (row < 0 || row >= SIZE || col < 0 || col >= SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(row + dr, col + dc);
          }
        }
      }
    };

    floodFill(r, c);
    setGrid(newGrid);

    // Check Win
    const allRevealed = newGrid.every(row => row.every(cell => cell.isMine || cell.isRevealed));
    if (allRevealed) setStatus('won');
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'playing' || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[320px] font-mono text-xs uppercase tracking-widest text-slate-500">
        <span>MINES: {MINES_COUNT}</span>
        <span className={status === 'won' ? 'text-emerald-400' : status === 'lost' ? 'text-red-400' : ''}>
          {status === 'playing' ? 'SCANNING' : status === 'won' ? 'VOID_CLEARED' : 'CORE_BREACHED'}
        </span>
      </div>

      <div className="grid grid-cols-10 gap-1 bg-slate-950 p-2 border-2 border-slate-800 rounded-xl shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold rounded-sm transition-all ${
              cell.isRevealed 
                ? 'bg-slate-900 text-slate-300 border border-slate-800/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-transparent border border-slate-700'
            } ${cell.isFlagged ? 'bg-indigo-900/40 text-indigo-400!' : ''}`}
          >
            {cell.isRevealed ? (
              cell.isMine ? <Bomb size={14} className="text-red-500" /> : 
              (cell.neighborMines > 0 ? cell.neighborMines : '')
            ) : (
              cell.isFlagged ? <Flag size={12} fill="currentColor" className="text-indigo-400" /> : ''
            )}
          </button>
        )))}
      </div>

      {status !== 'playing' && (
        <button onClick={createGrid} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-100 rounded-xl font-bold hover:bg-slate-700 transition-all border border-slate-700 animate-in fade-in">
          <RefreshCw size={16} /> RE-SCAN
        </button>
      )}
    </div>
  );
};

export default VoidSweeper;
