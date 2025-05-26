import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play } from 'lucide-react';
import { QuizSection } from './QuizSection';
import { BugGame } from './BugGame';
import { Congratulations } from '../Congratulations';
import { QuizReport } from '../QuizReport';
import { GameState } from '../../types';
import { quizQuestions } from '../../data/quizQuestions';
import { useUser } from '../../context/UserContext';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const LevelOne: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [showBugGame, setShowBugGame] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState(quizQuestions.slice(0, 10));
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showQuizReport, setShowQuizReport] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [bugGameScore, setBugGameScore] = useState(0);
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answeredQuestions: [],
    gameCompleted: false
  });

  useEffect(() => {
    setSelectedQuestions(shuffleArray(quizQuestions).slice(0, 10));
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleGameComplete = (finalScore: number) => {
    setQuizScore(finalScore);
    setShowQuizReport(true);
  };

  const handleContinueAfterQuizReport = () => {
    setShowQuizReport(false);
    if (quizScore >= 80) {
      setShowBugGame(true);
    } else {
      // If not enough correct answers, proceed to Level 2
      updateProgress({
        quizPoints: userProgress.quizPoints + quizScore,
        completedLevels: [...new Set([...userProgress.completedLevels, 1])],
        currentLevel: Math.max(userProgress.currentLevel, 2)
      });
      navigate('/level/2');
    }
  };

  const handleBugGameComplete = (bugScore: number) => {
    setBugGameScore(bugScore);
    setShowCongratulations(true);
  };

  const handleContinueAfterBugGame = () => {
    // Update game points (1 point per bug)
    updateProgress({
      quizPoints: userProgress.quizPoints + quizScore,
      gamePoints: userProgress.gamePoints + bugGameScore,
      completedLevels: [...new Set([...userProgress.completedLevels, 1])],
      currentLevel: Math.max(userProgress.currentLevel, 2)
    });
    
    // Navigate to Level 2
    navigate('/level/2');
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

        {!gameStarted && !showBugGame && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Level 1: Introduction to C Programming</h1>
            
            <div className="aspect-video mb-8 bg-black/30 rounded-lg">
              <div className="flex items-center justify-center h-full text-white/50">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/KnvbUiSxvbM"
                  title="Introduction to C Programming"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">What you'll learn:</h2>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Variables & Data Types</li>
                <li>Basic Input/Output (printf, scanf)</li>
                <li>Basic Syntax & Structure of a C program</li>
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

        {gameStarted && !showBugGame && !showQuizReport && !showCongratulations && (
          <QuizSection
            questions={selectedQuestions}
            gameState={gameState}
            setGameState={setGameState}
            onComplete={handleGameComplete}
          />
        )}

        {showQuizReport && (
          <QuizReport
            answeredQuestions={gameState.answeredQuestions}
            score={quizScore}
            totalQuestions={selectedQuestions.length}
            onContinue={handleContinueAfterQuizReport}
            title="Quiz Completed!"
            message={quizScore >= 80 ? "Great job! You've unlocked the bonus game!" : "Here's how you performed:"}
          />
        )}

        {showBugGame && !showCongratulations && (
          <BugGame onComplete={handleBugGameComplete} />
        )}

        {showCongratulations && (
          <Congratulations
            title="Level Complete!"
            message="You've mastered the basics of C programming!"
            score={quizScore + bugGameScore}
            maxScore={quizScore + 30}
            onContinue={handleContinueAfterBugGame}
          />
        )}
      </div>
    </div>
  );
};