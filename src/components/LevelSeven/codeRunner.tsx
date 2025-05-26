import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Code, Trophy } from 'lucide-react';

interface CodeRunnerProps {
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  code: string;
  missingPart: string;
  options: string[];
  correctIndex: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    code: `int factorial(int n) {
    if(n == 0 || n == 1)
        return 1;
    return _____________;
}`,
    missingPart: "n * factorial(n - 1)",
    options: [
      "n + factorial(n - 1)",
      "n * factorial(n - 1)",
      "n * factorial(n)",
      "factorial(n - 1)"
    ],
    correctIndex: 1
  },
  {
    id: 2,
    code: `void swap(int *a, int *b) {
    int temp = _____________;
    *a = *b;
    *b = temp;
}`,
    missingPart: "*a",
    options: [
      "a",
      "b",
      "*a",
      "*b"
    ],
    correctIndex: 2
  },
  {
    id: 3,
    code: `int findMax(int arr[], int n) {
    int max = arr[0];
    for(int i = 1; i < n; i++) {
        if(_____________)
            max = arr[i];
    }
    return max;
}`,
    missingPart: "arr[i] > max",
    options: [
      "arr[i] > max",
      "arr[i] < max",
      "max > arr[i]",
      "max < arr[i]"
    ],
    correctIndex: 0
  }
];

export const CodeRunner: React.FC<CodeRunnerProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === challenges[currentChallenge].correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback('✨ Correct! Great job!');

      setTimeout(() => {
        if (currentChallenge === challenges.length - 1) {
          setGameCompleted(true);
          setFeedback('🎉 All challenges completed!');
          setTimeout(() => onComplete(score + 10), 2000);
        } else {
          setCurrentChallenge(prev => prev + 1);
          setSelectedOption(null);
          setFeedback('');
        }
      }, 1500);
    } else {
      setFeedback('❌ Not quite right. Try again!');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 1500);
    }
  };

  const challenge = challenges[currentChallenge];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Speed Coding Challenge</h2>
        <p className="text-white/70">
          Complete the missing code segments as quickly as possible!
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-black/30 rounded-lg p-6 font-mono">
          {challenge.code.split('\n').map((line, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-8 text-white/50">{index + 1}</span>
              <span className={`${
                line.includes('_____________')
                  ? 'text-purple-400'
                  : 'text-white'
              }`}>
                {line}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {challenge.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
              className={`p-4 rounded-lg font-mono text-left transition-all ${
                selectedOption === null
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : selectedOption === index
                  ? index === challenge.correctIndex
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                  : index === challenge.correctIndex && 'bg-green-500/20 text-green-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg text-center ${
            feedback.includes('✨') || feedback.includes('🎉')
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-white">
            Challenge: <span className="font-bold">{currentChallenge + 1}/{challenges.length}</span>
          </div>
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};