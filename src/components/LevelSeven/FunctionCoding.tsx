import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, HelpCircle } from 'lucide-react';

interface FunctionCodingProps {
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  expectedOutput: string;
  hint: string;
  testCases: {
    input: string[];
    output: string[];
  }[];
  validationRules: {
    requiredPatterns: string[];
    forbiddenPatterns: string[];
  };
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Sum Function",
    description: "Write a function that takes two integers as parameters and returns their sum.",
    initialCode: `int add(int a, int b) {
    // Write your code here
    
}`,
    expectedOutput: "8",
    hint: "Use the return keyword to return the sum of a and b",
    testCases: [
      {
        input: ["5", "3"],
        output: ["8"]
      },
      {
        input: ["10", "-2"],
        output: ["8"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "return",
        "a",
        "b",
        "+"
      ],
      forbiddenPatterns: [
        "printf",
        "scanf"
      ]
    }
  },
  {
    id: 2,
    title: "Factorial Function",
    description: "Write a recursive function that calculates the factorial of a number.",
    initialCode: `int factorial(int n) {
    // Write your code here
    
}`,
    expectedOutput: "120",
    hint: "Use recursion: factorial(n) = n * factorial(n-1), with factorial(0) = 1",
    testCases: [
      {
        input: ["5"],
        output: ["120"]
      },
      {
        input: ["3"],
        output: ["6"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "return",
        "factorial",
        "*",
        "if"
      ],
      forbiddenPatterns: [
        "for",
        "while"
      ]
    }
  }
];

export const FunctionCoding: React.FC<FunctionCodingProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Randomly select one challenge
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(randomChallenge);
    setUserCode(randomChallenge.initialCode);
  }, []);

  const validateCode = (code: string, rules: Challenge['validationRules']): boolean => {
    // Check required patterns
    const hasAllRequired = rules.requiredPatterns.every(pattern => 
      code.toLowerCase().includes(pattern.toLowerCase())
    );

    // Check forbidden patterns
    const hasNoForbidden = rules.forbiddenPatterns.every(pattern => 
      !code.toLowerCase().includes(pattern.toLowerCase())
    );

    return hasAllRequired && hasNoForbidden;
  };

  const checkSolution = () => {
    if (!currentChallenge) return;

    // Remove whitespace and normalize code
    const normalizedCode = userCode.replace(/\s+/g, ' ').trim();

    // Validate code structure
    const isValid = validateCode(normalizedCode, currentChallenge.validationRules);

    if (isValid) {
      const points = Math.max(30 - attempts * 5, 10); // Reduce points for more attempts
      setScore(points);
      setFeedback('✨ Great job! Your function looks correct!');
      
      // Show success message for 3 seconds before completing
      setTimeout(() => {
        onComplete(points);
      }, 3000);
    } else {
      setAttempts(prev => prev + 1);
      setFeedback('❌ Not quite right. Make sure your function follows the requirements.');
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
              <CheckCircle className="w-5 h-5" />
              Submit Solution
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
          <h3 className="text-white font-semibold mb-2">Test Cases:</h3>
          <div className="space-y-2">
            {currentChallenge.testCases.map((testCase, index) => (
              <div key={index} className="text-white/70">
                <span className="font-mono">Input: {testCase.input.join(', ')}</span>
                <span className="mx-2">→</span>
                <span className="font-mono">Expected: {testCase.output.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};