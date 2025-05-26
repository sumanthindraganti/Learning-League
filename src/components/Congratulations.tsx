import React from 'react';
import { Trophy, Award, Star, Rocket } from 'lucide-react';

interface CongratulationsProps {
  title?: string;
  message?: string;
  score: number;
  maxScore?: number;
  onContinue: () => void;
  showConfetti?: boolean;
}

export const Congratulations: React.FC<CongratulationsProps> = ({ 
  title = "Congratulations!",
  message = "You've completed the challenge!",
  score, 
  maxScore = 100,
  onContinue,
  showConfetti = true
}) => {
  const percentage = maxScore ? (score / maxScore) * 100 : 100;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/70">{message}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Score:</span>
            </div>
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          
          {maxScore && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-400" />
                <span className="text-white">Performance:</span>
              </div>
              <span className="text-xl font-bold text-white">{Math.round(percentage)}%</span>
            </div>
          )}
          
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        {percentage >= 80 ? (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6">
            <p className="font-semibold">Excellent work! You've mastered this challenge!</p>
          </div>
        ) : percentage >= 50 ? (
          <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg mb-6">
            <p className="font-semibold">Good job! Keep practicing to improve your score.</p>
          </div>
        ) : (
          <div className="bg-blue-500/20 text-blue-300 p-4 rounded-lg mb-6">
            <p className="font-semibold">You're making progress! Try again to improve your skills.</p>
          </div>
        )}
        
        <button
          onClick={onContinue}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Rocket className="w-5 h-5" />
          Continue
        </button>
      </div>
    </div>
  );
};