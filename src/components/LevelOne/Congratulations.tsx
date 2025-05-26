import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';

interface CongratulationsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onClose: () => void;
}

export const Congratulations: React.FC<CongratulationsProps> = ({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  onClose 
}) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-white/70">You've completed the quiz!</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Score:</span>
            </div>
            <span className="text-2xl font-bold text-white">{score.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-green-400" />
              <span className="text-white">Correct Answers:</span>
            </div>
            <span className="text-xl font-bold text-white">{correctAnswers}/{totalQuestions}</span>
          </div>
          
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        {correctAnswers >= 8 ? (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6">
            <p className="font-semibold">Great job! You've unlocked the bonus game!</p>
          </div>
        ) : (
          <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg mb-6">
            <p className="font-semibold">You need 8 correct answers to unlock the bonus game. Try again!</p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {correctAnswers >= 8 ? 'Continue to Bonus Game' : 'Continue'}
        </button>
      </div>
    </div>
  );
};