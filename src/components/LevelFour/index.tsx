import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Code, Terminal, Book, CheckCircle } from 'lucide-react';
import ControlStructuresQuiz from './ControlStructuresQuiz';
import ControlStructuresEvaluator from './ControlStructuresEvaluator';
import { Congratulations } from '../Congratulations';
import { useUser } from '../../context/UserContext';

const locations = [
  { id: 1, name: 'Loop Zone', icon: Terminal },
  { id: 2, name: 'Conditionals Hub', icon: Code }
];

export const LevelFour: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [score, setScore] = useState(userProgress.quizPoints || 0);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleQuizComplete = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    setCurrentLocation(1);
  };

  const handleChallengeComplete = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    setShowCongratulations(true);
  };

  const handleContinueAfterCongratulations = () => {
    // Update user progress with accumulated score
    const updatedQuizPoints = userProgress.quizPoints + score;
    updateProgress({
      quizPoints: updatedQuizPoints,
      completedLevels: [...new Set([...userProgress.completedLevels, 4])],
      currentLevel: Math.max(userProgress.currentLevel, 5)
    });
    
    // Navigate to Level 5
    navigate('/level/5');
  };

  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/levels')}
          className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Levels
        </button>

        {!gameStarted && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Level 4: Control Structures in C</h1>
            
            <div className="aspect-video mb-8 bg-black/30 rounded-lg">
              <div className="flex items-center justify-center h-full text-white/50">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/1wsaV5nVC7g"
                  title="Control Structures in C Programming"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">What you'll learn:</h2>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Loops (for, while, do-while)</li>
                <li>Conditional Statements (if-else, switch-case)</li>
                <li>Loop Control (break, continue)</li>
                <li>Nested Control Structures</li>
              </ul>
              
              <button
                onClick={handleStartGame}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Level
              </button>
            </div>
          </div>
        )}

        {gameStarted && !showCongratulations && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {locations.map((location, index) => {
                  const LocationIcon = location.icon;
                  return (
                    <div
                      key={location.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        index === currentLocation
                          ? 'bg-white/20 text-white'
                          : index < currentLocation
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/5 text-white/50'
                      }`}
                    >
                      <LocationIcon className="w-5 h-5" />
                      <span>{location.name}</span>
                      {index < currentLocation && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-white">
                Score: <span className="font-bold">{score}</span>
              </div>
            </div>

            {currentLocation === 0 && (
              <ControlStructuresQuiz onComplete={handleQuizComplete} />
            )}
            
            {currentLocation === 1 && (
              <ControlStructuresEvaluator onComplete={handleChallengeComplete} />
            )}
          </div>
        )}

        {showCongratulations && (
          <Congratulations
            title="Level Complete!"
            message="You've mastered control structures in C!"
            score={score}
            maxScore={score + 50}
            onContinue={handleContinueAfterCongratulations}
          />
        )}
      </div>
    </div>
  );
};