import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, Play, HelpCircle } from 'lucide-react';

interface CodeError {
  id: number;
  line: number;
  incorrect: string;
  correct: string;
  hint: string;
}

interface FixTheCodeGameProps {
  onComplete: (score: number) => void;
}

const codeErrors: CodeError[] = [
  {
    id: 1,
    line: 1,
    incorrect: '#include stdio.h',
    correct: '#include <stdio.h>',
    hint: 'Header files need angle brackets'
  },
  {
    id: 2,
    line: 4,
    incorrect: 'printf("Hello World")',
    correct: 'printf("Hello World");',
    hint: 'Statements need semicolons'
  },
  {
    id: 3,
    line: 2,
    incorrect: 'int main[]',
    correct: 'int main()',
    hint: 'Main function needs parentheses'
  },
  {
    id: 4,
    line: 3,
    incorrect: 'Int x = 5;',
    correct: 'int x = 5;',
    hint: 'Data types are lowercase'
  },
  {
    id: 5,
    line: 5,
    incorrect: 'Return 0;',
    correct: 'return 0;',
    hint: 'Keywords are lowercase'
  },
  {
    id: 6,
    line: 6,
    incorrect: 'scanf("%d", number);',
    correct: 'scanf("%d", &number);',
    hint: 'scanf needs & operator for variables'
  },
  {
    id: 7,
    line: 7,
    incorrect: 'else if (x == 5);',
    correct: 'else if (x == 5)',
    hint: 'No semicolon after if condition'
  },
  {
    id: 8,
    line: 8,
    incorrect: 'for (i = 0, i < 10, i++)',
    correct: 'for (i = 0; i < 10; i++)',
    hint: 'For loop parts are separated by semicolons'
  }
];

export const FixTheCodeGame: React.FC<FixTheCodeGameProps> = ({ onComplete }) => {
  const [errors, setErrors] = useState<CodeError[]>([]);
  const [foundErrors, setFoundErrors] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedError, setSelectedError] = useState<CodeError | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [usedErrorIds, setUsedErrorIds] = useState<number[]>([]);

  useEffect(() => {
    if (gameStarted) {
      // Select 5 random errors that haven't been used yet
      const availableErrors = codeErrors.filter(error => !usedErrorIds.includes(error.id));
      const shuffled = [...availableErrors].sort(() => 0.5 - Math.random());
      const selectedErrors = shuffled.slice(0, 5);
      
      setErrors(selectedErrors);
      setUsedErrorIds(prev => [...prev, ...selectedErrors.map(e => e.id)]);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted]); // Removed usedErrorIds from dependency array to fix infinite loop

  useEffect(() => {
    if (gameOver || foundErrors.length === errors.length) {
      const timeout = setTimeout(() => onComplete(score), 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameOver, foundErrors.length, errors.length, score, onComplete]);

  const handleErrorClick = (error: CodeError) => {
    if (foundErrors.includes(error.id)) return;
    setSelectedError(error);
  };

  const handleCorrection = (correction: string) => {
    if (!selectedError) return;

    if (correction === selectedError.correct) {
      setFoundErrors(prev => [...prev, selectedError.id]);
      setScore(prev => prev + 10);
      setSelectedError(null);
    }
  };

  if (!gameStarted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Fix The Code Challenge</h2>
          <p className="text-white/70 mb-6">
            Find and fix syntax errors in the code snippets. Click on a line with an error, 
            then type the correct syntax in the input box.
          </p>
          
          <div className="bg-blue-500/20 p-6 rounded-lg mb-8 text-left">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">How to Play:</h3>
            <ul className="list-disc list-inside text-blue-200 space-y-2">
              <li>Click on any line that contains a syntax error</li>
              <li>Type the corrected code in the input box that appears</li>
              <li>You'll earn 10 points for each error you fix</li>
              <li>Try to find all errors before the time runs out</li>
              <li>Pay attention to common syntax issues like missing semicolons, brackets, or case sensitivity</li>
            </ul>
          </div>
          
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Fix the Code!</h2>
        <p className="text-white/70">Find and fix the syntax errors</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            <p className="text-white">
              Errors Found: <span className="font-bold">{foundErrors.length}/{errors.length}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-white">
              Score: <span className="font-bold">{score}</span>
            </p>
          </div>
        </div>
        <p className="text-white">
          Time: <span className="font-bold">{timeLeft}s</span>
        </p>
      </div>

      <div className="relative w-full bg-black/30 rounded-lg p-6 font-mono text-sm mb-6">
        {errors.map((error, index) => (
          <div
            key={error.id}
            className={`flex items-center gap-4 py-1 ${
              foundErrors.includes(error.id)
                ? 'text-green-400'
                : 'text-white cursor-pointer hover:text-purple-400'
            }`}
            onClick={() => handleErrorClick(error)}
          >
            <span className="w-8 text-white/50">{index + 1}</span>
            <span>{foundErrors.includes(error.id) ? error.correct : error.incorrect}</span>
            {foundErrors.includes(error.id) && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        ))}
      </div>

      {selectedError && (
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Fix this error:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/20 rounded-lg">
              <p className="text-red-300 font-mono">{selectedError.incorrect}</p>
            </div>
            <input
              type="text"
              placeholder="Type the correct syntax"
              className="p-4 bg-black/30 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleCorrection(e.target.value)}
            />
          </div>
          <div className="mt-4 p-4 bg-blue-500/20 rounded-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-300 flex-shrink-0" />
            <p className="text-blue-300">Hint: {selectedError.hint}</p>
          </div>
        </div>
      )}

      {(gameOver || foundErrors.length === errors.length) && (
        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            {foundErrors.length === errors.length ? 'Congratulations!' : 'Time\'s Up!'}
          </h3>
          <p className="text-xl text-white mb-4">
            You found {foundErrors.length} out of {errors.length} errors
          </p>
          <p className="text-green-400 animate-pulse">
            Level 2 Complete! Redirecting...
          </p>
        </div>
      )}
    </div>
  );
};