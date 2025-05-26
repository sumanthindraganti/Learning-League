import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizReportProps {
  answeredQuestions: {
    question: QuizQuestion;
    userAnswer: number;
    correct: boolean;
    usedHint?: boolean;
  }[];
  score: number;
  totalQuestions: number;
  onContinue: () => void;
}

export const QuizReport: React.FC<QuizReportProps> = ({
  answeredQuestions,
  score,
  totalQuestions,
  onContinue
}) => {
  const correctAnswers = answeredQuestions.filter(q => q.correct).length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Results</h2>
        <p className="text-white/70">You've completed all {totalQuestions} questions!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-white/70 mb-1">Score</p>
          <p className="text-3xl font-bold text-white">{score.toFixed(1)}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-white/70 mb-1">Correct Answers</p>
          <p className="text-3xl font-bold text-white">{correctAnswers}/{totalQuestions}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-white/70 mb-1">Accuracy</p>
          <p className="text-3xl font-bold text-white">{percentage.toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {correctAnswers >= 8 ? (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg">
            <p className="font-semibold text-center">Great job! You've unlocked the bonus game!</p>
          </div>
        ) : (
          <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg">
            <p className="font-semibold text-center">You need 8 correct answers to unlock the bonus game. Try again!</p>
          </div>
        )}
      </div>
      
      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-semibold text-white">Question Details:</h3>
        
        {answeredQuestions.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg ${
              item.correct ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                {item.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                Question {index + 1}
              </h4>
              <div className="flex items-center gap-2">
                {item.usedHint && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/30 text-yellow-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Used Hint
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.correct ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                }`}>
                  {item.correct ? 'Correct' :  'Incorrect'}
                </span>
              </div>
            </div>
            
            <p className="text-white font-medium mb-3">{item.question.question}</p>
            
            <div className="space-y-2">
              {item.question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`p-3 rounded ${
                    optIndex === item.question.correctAnswer
                      ? 'bg-green-500/30 text-green-300'
                      : optIndex === item.userAnswer && !item.correct
                      ? 'bg-red-500/30 text-red-300'
                      : 'bg-white/5 text-white/70'
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{option}</span>
                    {optIndex === item.question.correctAnswer && (
                      <span className="text-green-300 font-semibold">Correct Answer</span>
                    )}
                    {optIndex === item.userAnswer && !item.correct && (
                      <span className="text-red-300 font-semibold">Your Answer</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="mt-3 text-sm text-white/60">{item.question.explanation}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {correctAnswers >= 8 ? 'Continue to Bonus Game' : 'Continue to Next Level'}
        </button>
      </div>
    </div>
  );
};