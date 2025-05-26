import React, { useState, useEffect } from 'react';
import { RotateCw, Award, X, Circle } from 'lucide-react';

interface TicTacToeProps {
  onComplete: (score: number) => void;
}

type Player = 'X' | 'O';
type CellValue = Player | null;
type GameState = 'playing' | 'won' | 'draw';

export const TicTacToe: React.FC<TicTacToeProps> = ({ onComplete }) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Check for winner
  useEffect(() => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameState('won');
        setWinner(board[a] as Player);
        
        if (board[a] === 'X') {
          setPlayerScore(prev => prev + 1);
        } else {
          setComputerScore(prev => prev + 1);
        }
        
        return;
      }
    }

    // Check for draw
    if (!board.includes(null)) {
      setGameState('draw');
      setDrawScore(prev => prev + 1);
    }
  }, [board]);

  // Computer move
  useEffect(() => {
    if (currentPlayer === 'O' && gameState === 'playing') {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameState]);

  const makeComputerMove = () => {
    if (gameState !== 'playing') return;
    
    let move: number;
    
    switch (difficulty) {
      case 'hard':
        move = getBestMove();
        break;
      case 'medium':
        // 70% chance of making the best move, 30% chance of random move
        move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
        break;
      case 'easy':
      default:
        // 30% chance of making the best move, 70% chance of random move
        move = Math.random() < 0.3 ? getBestMove() : getRandomMove();
        break;
    }
    
    handleCellClick(move);
  };
  
  const getRandomMove = (): number => {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
      
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };
  
  const getBestMove = (): number => {
    // Simple minimax implementation
    const availableMoves = board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
    
    // Check for winning move
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'O';
      if (checkWinner(newBoard, 'O')) {
        return move;
      }
    }
    
    // Block player's winning move
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'X';
      if (checkWinner(newBoard, 'X')) {
        return move;
      }
    }
    
    // Take center if available
    if (board[4] === null) {
      return 4;
    }
    
    // Take corners if available
    const corners = [0, 2, 6, 8].filter(corner => board[corner] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    
    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };
  
  const checkWinner = (board: CellValue[], player: Player): boolean => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    
    return false;
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameState !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setGameCount(prev => prev + 1);
    
    // After 5 games, complete the mini-game
    if (gameCount >= 4) {
      // Calculate score based on wins
      const finalScore = playerScore * 20;
      onComplete(finalScore);
    }
  };

  const renderCell = (index: number) => {
    return (
      <button
        className={`w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center text-4xl font-bold transition-all ${
          board[index] === null && gameState === 'playing'
            ? 'hover:bg-white/10 cursor-pointer'
            : 'cursor-default'
        } ${
          winner && [0, 1, 2, 3, 4, 5, 6, 7, 8].some(i => board[i] === winner)
            ? 'bg-green-500/20'
            : ''
        }`}
        onClick={() => handleCellClick(index)}
        disabled={board[index] !== null || gameState !== 'playing' || currentPlayer === 'O'}
      >
        {board[index] === 'X' && <X className="w-12 h-12 text-blue-400" />}
        {board[index] === 'O' && <Circle className="w-12 h-12 text-red-400" />}
      </button>
    );
  };

  if (showInstructions) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Tic Tac Toe Challenge</h2>
        <p className="text-white/70 mb-6">
          Test your strategic thinking with this classic game!
        </p>
        
        <div className="bg-blue-500/20 p-6 rounded-lg mb-8 text-left">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">How to Play:</h3>
          <ul className="list-disc list-inside text-blue-200 space-y-2">
            <li>You play as X, the computer plays as O</li>
            <li>Take turns placing your mark in empty cells</li>
            <li>The first player to get three marks in a row (horizontally, vertically, or diagonally) wins</li>
            <li>If all cells are filled and no player has won, the game is a draw</li>
            <li>Win 5 games to complete the challenge</li>
            <li>Each win earns you 20 points</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Select Difficulty:</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                difficulty === 'easy' 
                  ? 'bg-green-500/50' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                difficulty === 'medium' 
                  ? 'bg-yellow-500/50' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                difficulty === 'hard' 
                  ? 'bg-red-500/50' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowInstructions(false)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tic Tac Toe</h2>
        <p className="text-white/70">
          {gameState === 'playing' 
            ? `Current player: ${currentPlayer === 'X' ? 'You (X)' : 'Computer (O)'}`
            : gameState === 'won'
              ? `${winner === 'X' ? 'You win!' : 'Computer wins!'}`
              : 'It\'s a draw!'}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 gap-2">
          {renderCell(0)}
          {renderCell(1)}
          {renderCell(2)}
          {renderCell(3)}
          {renderCell(4)}
          {renderCell(5)}
          {renderCell(6)}
          {renderCell(7)}
          {renderCell(8)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-blue-400" />
            <span className="text-white">You: {playerScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-red-400" />
            <span className="text-white">Computer: {computerScore}</span>
          </div>
          <div className="text-white/70">
            Draws: {drawScore}
          </div>
        </div>
        <div className="text-white">
          Games: <span className="font-bold">{gameCount}/5</span>
        </div>
      </div>

      {gameState !== 'playing' && (
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RotateCw className="w-5 h-5" />
            {gameCount >= 4 ? 'Complete Challenge' : 'Play Again'}
          </button>
        </div>
      )}

      {gameState !== 'playing' && gameCount >= 4 && (
        <div className="mt-6 p-4 bg-green-500/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Award className="w-6 h-6" />
            <span className="text-xl font-bold">
              Challenge complete! Your score: {playerScore * 20}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};