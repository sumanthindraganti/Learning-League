import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Code } from 'lucide-react';
import { QuizReportQuestion } from '../types';

interface QuizReportProps {
  answeredQuestions: QuizReportQuestion[];
  score: number;
  totalQuestions: number;
  onContinue: () => void;
  title?: string;
  message?: string;
}

export const QuizReport: React.FC<QuizReportProps> = ({
  answeredQuestions,
  score,
  totalQuestions,
  onContinue,
  title = "Quiz Results",
  message = "Here's how you performed:"
}) => {
  const correctAnswers = answeredQuestions.filter(q => q.correct).length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/70">{message}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-white/70 mb-1">Score</p>
          <p className="text-3xl font-bold text-white">{score}</p>
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
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className={`p-4 rounded-lg text-center ${
          percentage >= 80 ? 'bg-green-500/20 text-green-400' :
          percentage >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-blue-500/20 text-blue-300'
        }`}>
          {percentage >= 80 ? (
            <p className="font-semibold">Excellent work! You've mastered these concepts!</p>
          ) : percentage >= 60 ? (
            <p className="font-semibold">Good job! Keep practicing to improve further.</p>
          ) : (
            <p className="font-semibold">Keep practicing! You're making progress.</p>
          )}
        </div>
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
                {item.attempts && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-blue-300">
                    {item.attempts} Attempts
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.correct ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                }`}>
                  {item.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            </div>
            
            <p className="text-white font-medium mb-3">{item.question.question}</p>
            
            {item.question.code && (
              <pre className="bg-black/30 p-4 rounded-lg text-green-400 font-mono mb-4">
                {item.question.code}
              </pre>
            )}
            
            {item.attemptedAnswer && (
              <div className="mb-4">
                <p className="text-white/70 mb-2">Your Solution:</p>
                <pre className="bg-black/30 p-4 rounded-lg text-white/90 font-mono overflow-x-auto">
                  {item.attemptedAnswer}
                </pre>
              </div>
            )}
            
            {!item.correct && (
              <div className="mt-4">
                <p className="text-white/70 mb-2">Correct Solution:</p>
                <pre className="bg-green-500/10 p-4 rounded-lg text-green-400 font-mono overflow-x-auto">
                  {item.question.options[item.question.correctAnswer]}
                </pre>
              </div>
            )}
            
            <p className="mt-3 text-sm text-white/60">{item.question.explanation}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Continue to Mini-Game
        </button>
      </div>
    </div>
  );
};