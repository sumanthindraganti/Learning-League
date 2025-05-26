import React from 'react';

interface AlgorithmicMazeProps {
  onComplete: (score: number) => void;
}

export const AlgorithmicMaze: React.FC<AlgorithmicMazeProps> = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Algorithmic Maze</h2>
    </div>
  );
};