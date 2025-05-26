import React, { useState, useEffect, useCallback } from 'react';
import { Play, Trophy, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SnakeGameProps {
  onComplete: (score: number) => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = 'snake' | 'food' | null;

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MAX_SPEED = 80;
const SPEED_INCREMENT = 5;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<Cell[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood: Position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
      return generateFood();
    }

    return newFood;
  }, [snake]);

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    const initialFood = generateFood();
    
    // Create empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    
    // Place snake
    initialSnake.forEach(segment => {
      if (newGrid[segment.y] && newGrid[segment.y][segment.x] !== undefined) {
        newGrid[segment.y][segment.x] = 'snake';
      }
    });
    
    // Place food
    if (newGrid[initialFood.y] && newGrid[initialFood.y][initialFood.x] !== undefined) {
      newGrid[initialFood.y][initialFood.x] = 'food';
    }
    
    setGrid(newGrid);
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
  }, [generateFood]);

  // Start game
  const startGame = () => {
    initGame();
    setGameStarted(true);
  };

  // Reset game
  const resetGame = () => {
    initGame();
    setGameOver(false);
  };

  // Update game state
  const updateGame = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    // Create a copy of the snake
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    // Move head based on direction
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check if game over (wall collision)
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Check if game over (self collision)
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Add new head to snake
    newSnake.unshift(head);

    // Check if food eaten
    let newFood = food;
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      const newScore = score + 10;
      setScore(newScore);
      
      // Increase speed
      if (speed > MAX_SPEED) {
        setSpeed(prevSpeed => prevSpeed - SPEED_INCREMENT);
      }
      
      // Generate new food
      newFood = generateFood();
      setFood(newFood);
    } else {
      // Remove tail if no food eaten
      newSnake.pop();
    }

    // Update snake
    setSnake(newSnake);

    // Update grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    
    // Place snake
    newSnake.forEach(segment => {
      if (newGrid[segment.y] && newGrid[segment.y][segment.x] !== undefined) {
        newGrid[segment.y][segment.x] = 'snake';
      }
    });
    
    // Place food
    if (newGrid[newFood.y] && newGrid[newFood.y][newFood.x] !== undefined) {
      newGrid[newFood.y][newFood.x] = 'food';
    }
    
    setGrid(newGrid);
  }, [direction, food, gameOver, gameStarted, generateFood, isPaused, score, snake, speed, highScore]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(updateGame, speed);
    return () => clearInterval(gameInterval);
  }, [updateGame, speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, direction]);

  // Handle game completion
  useEffect(() => {
    if (gameOver) {
      const timeout = setTimeout(() => {
        onComplete(score);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameOver, score, onComplete]);

  // Render game
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Snake Game</h2>
        <p className="text-white/70">
          Eat the food to grow your snake and earn points!
          {!gameStarted && " Press Start to begin, then use arrow keys to control the snake."}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
          <div className="text-white">
            High Score: <span className="font-bold">{highScore}</span>
          </div>
        </div>

        <div 
          className="relative bg-black/30 rounded-lg overflow-hidden"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE 
          }}
        >
          {!gameStarted ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Game
              </button>
            </div>
          ) : (
            <>
              {/* Render grid */}
              {grid.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] ${
                        cell === 'snake' 
                          ? 'bg-green-500' 
                          : cell === 'food' 
                          ? 'bg-red-500 rounded-full' 
                          : ''
                      }`}
                      style={{ 
                        width: CELL_SIZE, 
                        height: CELL_SIZE,
                        backgroundColor: cell === 'snake' 
                          ? '#10b981' // green-500
                          : cell === 'food' 
                          ? '#ef4444' // red-500
                          : 'transparent'
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Game over overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                  <p className="text-xl text-white mb-4">
                    Final Score: <span className="font-bold">{score}</span>
                  </p>
                  <p className="text-green-400 animate-pulse">
                    Level 5 Complete! Redirecting...
                  </p>
                </div>
              )}

              {/* Pause overlay */}
              {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">Paused</h3>
                </div>
              )}
            </>
          )}
        </div>

        {gameStarted && !gameOver && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div></div>
            <button
              onClick={() => direction !== 'DOWN' && setDirection('UP')}
              className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowUp className="w-6 h-6 mx-auto" />
            </button>
            <div></div>
            
            <button
              onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
              className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 mx-auto" />
            </button>
            
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {isPaused ? <Play className="w-6 h-6 mx-auto" /> : <RefreshCw className="w-6 h-6 mx-auto" />}
            </button>
            
            <button
              onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
              className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-6 h-6 mx-auto" />
            </button>
            
            <div></div>
            <button
              onClick={() => direction !== 'UP' && setDirection('DOWN')}
              className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowDown className="w-6 h-6 mx-auto" />
            </button>
            <div></div>
          </div>
        )}

        {gameStarted && gameOver && (
          <button
            onClick={resetGame}
            className="mt-6 px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};