import React, { useState, useEffect, useCallback } from 'react';
import { Bug, Target } from 'lucide-react';

interface BugGameProps {
  onComplete: (score: number) => void;
}

interface BugEntity {
  id: number;
  x: number;
  y: number;
  speed: number;
}

export const BugGame: React.FC<BugGameProps> = ({ onComplete }) => {
  const [bugs, setBugs] = useState<BugEntity[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const spawnBug = useCallback(() => {
    // Container dimensions
    const containerWidth = 600;
    const containerHeight = 400;
    
    const newBug: BugEntity = {
      id: Date.now(),
      x: Math.random() * (containerWidth - 40), // Accounting for bug size
      y: Math.random() * (containerHeight - 40),
      speed: 2 + Math.random() * 2
    };
    setBugs(prev => [...prev, newBug]);
  }, []);

  const removeBug = (id: number) => {
    setBugs(prev => prev.filter(bug => bug.id !== id));
    setScore(prev => prev + 1);
  };

  useEffect(() => {
    const spawnInterval = setInterval(spawnBug, 1000);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(spawnInterval);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [spawnBug]);

  useEffect(() => {
    if (gameOver) {
      const timeout = setTimeout(() => onComplete(score), 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameOver, score, onComplete]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Bug Squashing Challenge!</h2>
        <p className="text-white/70">Click on the bugs to squash them</p>
      </div>

      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <p className="text-white">
            Score: <span className="font-bold">{score}</span>
          </p>
        </div>
        <p className="text-white">
          Time: <span className="font-bold">{timeLeft}s</span>
        </p>
      </div>

      {!gameOver ? (
        <div className="relative w-[600px] h-[400px] mx-auto bg-black/20 rounded-lg overflow-hidden border-2 border-white/10">
          {bugs.map(bug => (
            <div
              key={bug.id}
              className="absolute transition-transform cursor-pointer hover:scale-110"
              style={{ left: bug.x, top: bug.y }}
              onClick={() => removeBug(bug.id)}
            >
              <Bug className="w-8 h-8 text-red-400 animate-bounce" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] bg-black/20 rounded-lg border-2 border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-4">
            Bugs squashed: <span className="font-bold text-purple-400">{score}</span>
          </p>
          <div className="text-green-400 font-semibold animate-pulse">
            Level 1 Complete! Redirecting...
          </div>
        </div>
      )}
    </div>
  );
};