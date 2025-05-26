import React, { useState, useEffect } from 'react';
import { Play, Search, CheckCircle, HelpCircle, Clock } from 'lucide-react';

interface CodeRunnerProps {
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  expression: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    expression: "5 * 3 + 2",
    options: ["17", "25", "21", "15"],
    correctAnswer: 0,
    points: 10
  },
  {
    id: 2,
    expression: "15 % 4 * 2",
    options: ["2", "7.5", "6", "3"],
    correctAnswer: 2,
    points: 15
  },
  {
    id: 3,
    expression: "10 > 5 && 3 < 2",
    options: ["1", "0", "true", "false"],
    correctAnswer: 1,
    points: 20
  },
  {
    id: 4,
    expression: "!((4 >= 4) || (2 < 1))",
    options: ["1", "0", "true", "false"],
    correctAnswer: 1,
    points: 25
  },
  {
    id: 5,
    expression: "(20 / 4) % 3",
    options: ["2", "1", "0", "3"],
    correctAnswer: 0,
    points: 30
  }
];

export const CodeRunner: React.FC<CodeRunnerProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [gameStarted, timeLeft]);

  const handleAnswer = (answerIndex: number) => {
    const challenge = challenges[currentChallenge];
    const isCorrect = answerIndex === challenge.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + challenge.points);
      setFeedback('✨ Correct!');
    } else {
      setFeedback('❌ Wrong answer!');
    }

    setTimeout(() => {
      setFeedback('');
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
      } else {
        handleGameOver();
      }
    }, 1000);
  };

  const handleGameOver = () => {
    onComplete(score);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Operator Challenge</h2>
        <p className="text-white/70 mb-8">
          Solve operator expressions as quickly as possible!
        </p>
        <button
          onClick={() => setGameStarted(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
        >
          <Play className="w-5 h-5" />
          Start Challenge
        </button>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Operator Challenge</h2>
        <div className="flex items-center gap-4">
          <div className="text-white">
            Time: <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-black/30 p-8 rounded-lg text-center">
          <div className="text-3xl font-mono text-white mb-4 flex items-center justify-center gap-2">
            <Search className="w-6 h-6 text-purple-400" />
            {challenge.expression}
          </div>
          <p className="text-white/70">What is the result of this expression?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {challenge.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xl font-mono transition-colors"
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg text-center text-lg ${
            feedback.includes('✨') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-white">
            Challenge: <span className="font-bold">{currentChallenge + 1}/{challenges.length}</span>
          </div>
          <div className="text-white/70">
            Points available: <span className="font-bold text-purple-400">+{challenge.points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};