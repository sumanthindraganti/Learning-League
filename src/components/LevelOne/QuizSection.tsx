import React, { useState } from 'react';
import { QuizQuestion, GameState } from '../../types';
import { Monitor, Cpu, Keyboard, Mouse, HardDrive, Printer, Server, Wifi, Database, Cloud } from 'lucide-react';

const locations = [
  { icon: Monitor, label: 'Monitor Station' },
  { icon: Cpu, label: 'CPU Core' },
  { icon: Keyboard, label: 'Keyboard Hub' },
  { icon: Mouse, label: 'Mouse Port' },
  { icon: HardDrive, label: 'Storage Center' },
  { icon: Printer, label: 'Print Station' },
  { icon: Server, label: 'Server Room' },
  { icon: Wifi, label: 'Network Node' },
  { icon: Database, label: 'Data Center' },
  { icon: Cloud, label: 'Cloud Platform' }
];

interface QuizSectionProps {
  questions: QuizQuestion[];
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onComplete: (score: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  gameState,
  setGameState,
  onComplete
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
  const currentQuestion = questions[gameState.currentQuestionIndex];
  const LocationIcon = locations[gameState.currentQuestionIndex].icon;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return; // Prevent multiple clicks during feedback
    if (attemptedAnswers.includes(answerIndex)) return; // Prevent selecting the same wrong answer twice

    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      // Add this answer to attempted answers
      setAttemptedAnswers(prev => [...prev, answerIndex]);
    }

    setTimeout(() => {
      setShowFeedback(false);
      const newScore = correct ? gameState.score + 1 : gameState.score;

      const newAnsweredQuestions = [
        ...gameState.answeredQuestions,
        {
          question: currentQuestion,
          userAnswer: answerIndex,
          correct
        }
      ];

      if (gameState.currentQuestionIndex === questions.length - 1) {
        setGameState({
          ...gameState,
          score: newScore,
          answeredQuestions: newAnsweredQuestions,
          gameCompleted: true
        });
        onComplete(newScore * 10); // Each correct answer is worth 10 points
      } else {
        setGameState({
          ...gameState,
          currentQuestionIndex: gameState.currentQuestionIndex + 1,
          score: newScore,
          answeredQuestions: newAnsweredQuestions
        });
        // Reset attempted answers for the next question
        setAttemptedAnswers([]);
      }
    }, 1500);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex items-center gap-4 mb-8">
        <LocationIcon className="w-8 h-8 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">
          {locations[gameState.currentQuestionIndex].label}
        </h2>
      </div>

      <div className="mb-8">
        <p className="text-lg text-white mb-6">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback || attemptedAnswers.includes(index)}
              className={`p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left text-white transition-all ${
                showFeedback && index === currentQuestion.correctAnswer
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : showFeedback && index === currentQuestion.correctAnswer
                  ? 'bg-red-500/20 border-2 border-red-500/50'
                  : ''
              } ${
                attemptedAnswers.includes(index)
                  ? 'opacity-50 cursor-not-allowed'
                  : showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        } text-white font-bold animate-bounce`}>
          {isCorrect ? 'Correct! 🎉' : 'Incorrect! 😕'}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-white/70">
          Question {gameState.currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className="text-white">
          Score: <span className="font-bold">{gameState.score}</span>
        </p>
      </div>
    </div>
  );
};