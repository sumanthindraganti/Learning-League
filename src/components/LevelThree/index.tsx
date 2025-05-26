import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Code, Terminal, Book, CheckCircle } from 'lucide-react';
import { CodeJumbleChallenge } from './CodeJumbleChallenge';
import { CodeRunner } from './CodeRunner';
import { Congratulations } from '../Congratulations';
import { useUser } from '../../context/UserContext';

const locations = [
  { id: 1, name: 'Code Assembly', icon: Terminal },
  { id: 2, name: 'Logic Flow', icon: Code },
  { id: 3, name: 'Final Test', icon: Book }
];

export const LevelThree: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [score, setScore] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleChallengeComplete = (points: number) => {
    setScore(prev => prev + points);
    setShowCongratulations(true);
  };

  const handleContinueAfterChallenges = () => {
    setShowCongratulations(false);
    setShowMiniGame(true);
  };

  const handleMiniGameComplete = (gameScore: number) => {
    setMiniGameScore(gameScore);
    setShowCongratulations(true);
  };

  const handleContinueAfterMiniGame = () => {
    // Update user progress
    updateProgress({
      quizPoints: userProgress.quizPoints + score,
      gamePoints: userProgress.gamePoints + miniGameScore,
      completedLevels: [...new Set([...userProgress.completedLevels, 3])],
      currentLevel: Math.max(userProgress.currentLevel, 4)
    });
    
    // Navigate to Level 4 instead of levels page
    navigate('/level/4');
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

        {!gameStarted && !showMiniGame && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Level 3: Logical Sequencing in C</h1>
            
            <div className="aspect-video mb-8 bg-black/30 rounded-lg">
              <div className="flex items-center justify-center h-full text-white/50">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/HucJhUkDJuk"
                  title="Logical Sequencing in C Programming"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">What you'll learn:</h2>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Program Structure and Flow</li>
                <li>Logical Sequence of Operations</li>
                <li>Code Organization Best Practices</li>
                <li>Understanding Program Execution Order</li>
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

        {gameStarted && !showMiniGame && (
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

            <CodeJumbleChallenge onComplete={handleChallengeComplete} />
          </div>
        )}

        {showMiniGame && !showCongratulations && (
          <CodeRunner onComplete={handleMiniGameComplete} />
        )}

        {showCongratulations && !showMiniGame && (
          <Congratulations
            title="Challenge Completed!"
            message="You've mastered code sequencing!"
            score={score}
            maxScore={100}
            onContinue={handleContinueAfterChallenges}
          />
        )}

        {showCongratulations && showMiniGame && (
          <Congratulations
            title="Level Complete!"
            message="You've mastered logical sequencing in C!"
            score={score + miniGameScore}
            maxScore={score + 100}
            onContinue={handleContinueAfterMiniGame}
          />
        )}
      </div>
    </div>
  );
};