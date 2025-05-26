import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, HelpCircle } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  code: string;
  expectedOutput: string;
  hint: string;
  testCases: {
    input: string[];
    output: string[];
  }[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Loop Completion",
    description: "Write a for loop to print numbers from 1 to 10",
    code: `#include <stdio.h>

int main() {
    // Write your loop here
    
    return 0;
}`,
    expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n",
    hint: "Use a for loop with i starting from 1 and going up to 10",
    testCases: [
      {
        input: [],
        output: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      }
    ]
  },
  
  {
    id: 2,
    title: "Conditional Logic",
    description: "Write an if-else statement to check if a number is positive, negative, or zero",
    code: `void checkNumber(int num) {
    // Write your if-else statement here
    
}`,
    expectedOutput: "Positive\n",
    hint: "Use if, else if, and else to check the number's sign",
    testCases: [
      {
        input: ["5"],
        output: ["Positive"]
      }
    ]
  }
];

interface CodeCompletionChallengeProps {
  locationIndex: number;
  onComplete: (score: number) => void;
}

export const CodeCompletionChallenge: React.FC<CodeCompletionChallengeProps> = ({
  locationIndex,
  onComplete
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const challenge = challenges[locationIndex];
    if (challenge) {
      setCurrentChallenge(challenge);
      setUserCode(challenge.code);
      setFeedback('');
      setShowHint(false);
      setAttempts(0);
    }
  }, [locationIndex]);

  const checkSolution = () => {
    if (!currentChallenge) return;

    // Simple validation based on expected patterns
    let isCorrect = false;

    switch (currentChallenge.id) {
      case 1: // Loop
        isCorrect = userCode.includes('for') && 
                   userCode.includes('printf') && 
                   userCode.includes('i <= 10') || userCode.includes('i < 11');
        break;
      case 2: // Function
        isCorrect = userCode.includes('return') && 
                   userCode.includes('a + b');
        break;
      case 3: // Conditional
        isCorrect = userCode.includes('if') && 
                   userCode.includes('else') && 
                   userCode.includes('printf') &&
                   userCode.includes('> 0') &&
                   userCode.includes('< 0');
        break;
    }

    if (isCorrect) {
      const points = Math.max(20 - attempts * 5, 5); // Reduce points for more attempts
      setFeedback('✨ Correct! Moving to next challenge...');
      setTimeout(() => onComplete(points), 1500);
    } else {
      setAttempts(prev => prev + 1);
      setFeedback('❌ Not quite right. Try again!');
      setShowHint(true);
    }
  };

  if (!currentChallenge) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h2>
        <p className="text-white/70">{currentChallenge.description}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-black/30 rounded-lg p-6">
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-64 bg-transparent text-white font-mono focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={checkSolution}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Run Code
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
          {attempts > 0 && (
            <p className="text-white/70">
              Attempts: <span className="font-bold">{attempts}</span>
            </p>
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg ${
            feedback.includes('✨') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {showHint && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">💡 Hint: {currentChallenge.hint}</p>
          </div>
        )}

        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Expected Output:</h3>
          <pre className="text-green-400 font-mono">{currentChallenge.expectedOutput}</pre>
        </div>
      </div>
    </div>
  );
};