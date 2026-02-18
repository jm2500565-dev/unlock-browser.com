
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      // eslint-disable-next-line no-loop-func
      const isOnSnake = snake.some(part => part.x === newFood?.x && part.y === newFood?.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision check
      if (prevSnake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food check
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = window.setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px]">
        <div className="text-xl font-orbitron font-bold text-indigo-400">Score: {score}</div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest self-end">
          {isPaused ? "Paused (SPACE)" : "Playing"}
        </div>
      </div>

      <div className="relative bg-slate-950 border-4 border-slate-800 rounded-xl shadow-2xl overflow-hidden" 
           style={{ width: '400px', height: '400px', display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(p => p.x === x && p.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`w-full h-full transition-all duration-100 ${
                isHead ? 'bg-indigo-400 rounded-sm shadow-[0_0_10px_rgba(129,140,248,0.8)] z-10' : 
                isSnake ? 'bg-indigo-600/40 rounded-sm' : 
                isFood ? 'bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 
                'bg-transparent border-[0.5px] border-slate-900/50'
              }`}
            />
          );
        })}

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-4xl font-orbitron font-extrabold text-red-500 mb-2">Game Over</h2>
            <p className="text-slate-400 mb-6">Final Score: <span className="text-white font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })} className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">↑</button>
        <div />
        <button onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })} className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">←</button>
        <button onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })} className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">↓</button>
        <button onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })} className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">→</button>
      </div>
    </div>
  );
};

export default SnakeGame;
