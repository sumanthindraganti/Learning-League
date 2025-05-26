import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Code, Terminal, Book, CheckCircle } from 'lucide-react';
import { CodingChallenge } from './CodingChallenge';
import { FixTheCodeGame } from './FixTheCodeGame';
import { Congratulations } from '../Congratulations';
import { QuizReport } from '../QuizReport';
import { useUser } from '../../context/UserContext';

interface ChallengeAttempt {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
}

const locations = [
  { id: 1, name: 'Whiteboard', icon: Terminal },
  { id: 2, name: 'Coding Terminal', icon: Code },
  { id: 3, name: 'Study Notebook', icon: Book }
];

export const LevelTwo: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [correctChallenges, setCorrectChallenges] = useState(0);
  const [score, setScore] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [challengeAttempts, setChallengeAttempts] = useState<ChallengeAttempt[]>([]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleChallengeComplete = (points: number, correctCount: number, challengeData: ChallengeAttempt) => {
    setScore(prev => prev + points);
    setCompletedChallenges(prev => prev + 1);
    setCorrectChallenges(prev => prev + (correctCount > 0 ? 1 : 0));
    setChallengeAttempts(prev => [...prev, challengeData]);
    
    if (completedChallenges + 1 >= 3) {
      setShowReport(true);
    } else {
      setCurrentLocation(prev => prev + 1);
    }
  };

  const handleReportContinue = () => {
    setShowReport(false);
    if (correctChallenges >= 2) {
      setShowMiniGame(true);
    } else {
      setShowCongratulations(true);
    }
  };

  const handleMiniGameComplete = (gameScore: number) => {
    setMiniGameScore(gameScore);
    setShowCongratulations(true);
  };

  const handleContinueAfterMiniGame = () => {
    updateProgress({
      quizPoints: userProgress.quizPoints + score,
      gamePoints: userProgress.gamePoints + miniGameScore,
      completedLevels: [...new Set([...userProgress.completedLevels, 2])],
      currentLevel: Math.max(userProgress.currentLevel, 3)
    });
    
    navigate('/level/3');
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

        {!gameStarted && !showMiniGame && !showReport && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Level 2: Basic Syntax & I/O in C</h1>
            
            <div className="aspect-video mb-8 bg-black/30 rounded-lg">
              <div className="flex items-center justify-center h-full text-white/50">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/dhh5lrXXXYw"
                  title="Basic Syntax & I/O in C Programming"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">What you'll learn:</h2>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Basic syntax of a C program</li>
                <li>Variables and data types</li>
                <li>Input/Output operations (printf, scanf)</li>
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

        {gameStarted && !showMiniGame && !showReport && !showCongratulations && (
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

            <CodingChallenge
              locationIndex={currentLocation}
              onComplete={handleChallengeComplete}
            />
          </div>
        )}

        {showReport && (
          <QuizReport
            answeredQuestions={challengeAttempts.map((attempt, index) => ({
              question: {
                id: index,
                question: attempt.question,
                options: [attempt.correctAnswer],
                correctAnswer: 0,
                explanation: `Correct solution: ${attempt.correctAnswer}`
              },
              userAnswer: 0,
              correct: attempt.isCorrect,
              usedHint: false,
              attemptedAnswer: attempt.userAnswer,
              attempts: attempt.attempts
            }))}
            score={score}
            totalQuestions={3}
            onContinue={handleReportContinue}
            title="Level 2 Progress Report"
            message={correctChallenges >= 2 
              ? "Great job! You've unlocked the mini-game!" 
              : "Keep practicing to improve your skills!"}
          />
        )}

        {showMiniGame && !showCongratulations && (
          <FixTheCodeGame onComplete={handleMiniGameComplete} />
        )}

        {showCongratulations && (
          <Congratulations
            title="Level Complete!"
            message="You've mastered the basics of C syntax and I/O!"
            score={score + miniGameScore}
            maxScore={score + 50}
            onContinue={handleContinueAfterMiniGame}
          />
        )}
      </div>
    </div>
  );
};