import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, RefreshCw, Trophy } from 'lucide-react';

interface ArrayAdventureProps {
  onComplete: (score: number) => void;
}

interface GridCell {
  value: number;
  isSelected: boolean;
  isTarget: boolean;
}

const GRID_SIZE = 5;

export const ArrayAdventure: React.FC<ArrayAdventureProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedCells, setSelectedCells] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{row: number, col: number, value: number}[]>([]);

  const challenges = [
    {
      title: "Find the Largest Number",
      description: "Click on the largest number in the array",
      validate: (selected: GridCell[][]) => {
        const largest = Math.max(...grid.flat().map(cell => cell.value));
        return selected.flat().some(cell => cell.isSelected && cell.value === largest);
      }
    },
    {
      title: "Select Even Numbers",
      description: "Click on all even numbers in the array",
      validate: (selected: GridCell[][]) => {
        const evenCount = grid.flat().filter(cell => cell.value % 2 === 0).length;
        const selectedEvenCount = selected.flat().filter(cell => 
          cell.isSelected && cell.value % 2 === 0
        ).length;
        const selectedOddCount = selected.flat().filter(cell => 
          cell.isSelected && cell.value % 2 !== 0
        ).length;
        
        // Make sure all even numbers are selected AND no odd numbers are selected
        return evenCount === selectedEvenCount && selectedOddCount === 0;
      }
    },
    {
      title: "Select Odd Numbers",
      description: "Click on all odd numbers in the array",
      validate: (selected: GridCell[][]) => {
        const oddCount = grid.flat().filter(cell => cell.value % 2 !== 0).length;
        const selectedOddCount = selected.flat().filter(cell => 
          cell.isSelected && cell.value % 2 !== 0
        ).length;
        const selectedEvenCount = selected.flat().filter(cell => 
          cell.isSelected && cell.value % 2 === 0
        ).length;
        
        // Make sure all odd numbers are selected AND no even numbers are selected
        return oddCount === selectedOddCount && selectedEvenCount === 0;
      }
    }
  ];

  const generateMaze = () => {
    const walls = [];
    // Generate random walls that don't block the path
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (x !== 0 && y !== 0 && x !== 5 && y !== 5) {
        walls.push({ x, y });
      }
    }
    return walls;
  };

  const initializeGrid = () => {
    const newGrid: GridCell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        value: Math.floor(Math.random() * 50) + 1,
        isSelected: false,
        isTarget: false
      }))
    );
    setGrid(newGrid);
    setSelectedOrder([]);
  };

  useEffect(() => {
    initializeGrid();
  }, [currentChallenge]);

  const handleCellClick = (row: number, col: number) => {
    if (!gameStarted || isValidating) return;

    // Create a deep copy of the grid
    const newGrid = JSON.parse(JSON.stringify(grid));
    const cell = newGrid[row][col];
    const newIsSelected = !cell.isSelected;
    
    // Update the cell's selection state
    newGrid[row][col] = {
      ...cell,
      isSelected: newIsSelected
    };
    
    // Update the grid state
    setGrid(newGrid);
    setSelectedCells(prev => prev + (newIsSelected ? 1 : -1));
  };

  const checkChallenge = () => {
    if (isValidating) return;
    
    setIsValidating(true);
    const challenge = challenges[currentChallenge];
    const isCorrect = challenge.validate(grid);

    if (isCorrect) {
      setScore(prev => prev + 50);
      setFeedback('🎉 Challenge completed!');
      
      if (currentChallenge === challenges.length - 1) {
        setTimeout(() => {
          setFeedback('🏆 Congratulations! You\'ve mastered arrays!');
          setTimeout(() => onComplete(score + 50), 3000);
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentChallenge(prev => prev + 1);
          setSelectedCells(0);
          setFeedback('');
          initializeGrid();
          setIsValidating(false);
        }, 1500);
      }
    } else {
      setFeedback('❌ Not quite right. Try again!');
      setTimeout(() => {
        setFeedback('');
        // Reset the grid - all cells unselected
        setGrid(prev => prev.map(row => 
          row.map(cell => ({ ...cell, isSelected: false }))
        ));
        setSelectedCells(0);
        setSelectedOrder([]);
        setIsValidating(false);
      }, 1500);
    }
  };

  const handleGameOver = () => {
    setGameStarted(false);
    onComplete(score);
  };

  const currentChallengeData = challenges[currentChallenge];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Array Adventure</h2>
        <p className="text-white/70">Master arrays through interactive challenges!</p>
      </div>

      {!gameStarted ? (
        <div className="text-center">
          <div className="bg-blue-500/20 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">How to Play:</h3>
            <ul className="list-disc list-inside text-blue-200 space-y-2">
              <li>You'll face three array-based challenges</li>
              <li>Each challenge requires you to interact with a grid of numbers</li>
              <li>Click on grid cells according to the challenge instructions</li>
              <li>Click "Check Solution" when you're ready to submit your answer</li>
              <li>Complete all challenges to finish the game</li>
              <li>The faster you complete challenges, the more points you earn!</li>
            </ul>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Challenge {currentChallenge + 1}: {currentChallengeData.title}
            </h3>
            <p className="text-white/70">{currentChallengeData.description}</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={isValidating}
                    className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${
                      cell.isSelected
                        ? 'bg-purple-500/50 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    } ${isValidating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  >
                    <div className="relative">
                      {cell.value}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={checkChallenge}
              disabled={isValidating}
              className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${
                isValidating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Check Solution
            </button>

            <div className="flex items-center gap-4">
              <div className="text-white">
                Score: <span className="font-bold">{score}</span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              feedback.includes('🎉') || feedback.includes('🏆')
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {feedback}
            </div>
          )}
        </>
      )}
    </div>
  );
};