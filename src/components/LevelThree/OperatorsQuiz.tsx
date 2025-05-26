import React, { useState } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface OperatorsQuizProps {
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the output of this expression?",
    code: "int x = 10 + 5 * 2;",
    options: [
      "30",
      "20",
      "25",
      "15"
    ],
    correctAnswer: 1,
    explanation: "Multiplication has higher precedence than addition. So, 5 * 2 = 10 is evaluated first, then 10 + 10 = 20.",
    hint: "Remember operator precedence: multiplication before addition"
  },
  {
    id: 2,
    question: "What is the result of this logical expression?",
    code: "(5 > 3) && (4 < 7)",
    options: [
      "0",
      "1",
      "true",
      "false"
    ],
    correctAnswer: 1,
    explanation: "Both conditions are true: 5 > 3 is true AND 4 < 7 is true, so the result is 1 (true in C).",
    hint: "Evaluate each condition separately, then combine with AND"
  },
  {
    id: 3,
    question: "What is the value of x after this operation?",
    code: "int x = 15 % 4;",
    options: [
      "3",
      "3.75",
      "4",
      "1"
    ],
    correctAnswer: 0,
    explanation: "The modulo operator % returns the remainder after division. 15 divided by 4 is 3 with remainder 3.",
    hint: "Think about what remains after dividing 15 by 4"
  },
  {
    id: 4,
    question: "What is the result of this comparison?",
    code: "5 >= 5",
    options: [
      "0",
      "1",
      "Error",
      "undefined"
    ],
    correctAnswer: 1,
    explanation: "The >= operator checks if the left value is greater than or equal to the right value. Since 5 equals 5, the result is 1 (true).",
    hint: "Greater than or equal includes equality"
  },
  {
    id: 5,
    question: "What is the output of this expression?",
    code: "!((5 > 3) || (2 < 1))",
    options: [
      "1",
      "0",
      "true",
      "false"
    ],
    correctAnswer: 1,
    explanation: "(5 > 3) is true, (2 < 1) is false, true OR false is true, and NOT true is false (0).",
    hint: "Solve from innermost parentheses outward"
  }
];

export const OperatorsQuiz: React.FC<OperatorsQuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      setFeedback('✨ Correct! Well done!');
    } else {
      setFeedback('❌ Not quite right. Try again!');
    }
    
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback('');
      
      if (isCorrect) {
        if (currentQuestionIndex === questions.length - 1) {
          setFeedback('🎉 Quiz completed! Starting mini-game...');
          setTimeout(() => onComplete(score + 20), 2000);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Operators Quiz</h2>
        <p className="text-white/70">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>

      <div className="space-y-6">
        <div className="text-lg text-white">{currentQuestion.question}</div>

        {currentQuestion.code && (
          <div className="bg-black/30 p-4 rounded-lg">
            <pre className="text-green-400 font-mono">{currentQuestion.code}</pre>
          </div>
        )}

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`p-4 rounded-lg text-left transition-all ${
                showFeedback && index === currentQuestion.correctAnswer
                  ? 'bg-green-500/20 text-green-400'
                  : showFeedback && index === selectedAnswer
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>

          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>

        {showHint && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">💡 Hint: {currentQuestion.hint}</p>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-lg text-lg ${
            feedback.includes('✨') || feedback.includes('🎉')
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {showFeedback && (
          <div className="p-4 bg-purple-500/20 rounded-lg">
            <p className="text-purple-400">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};