import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Code, Terminal, Book, CheckCircle, Download } from 'lucide-react';
import { MemoryGame } from './MemoryGame';
import { PointerQuiz } from './PointerQuiz';
import { MemoryScramble } from './MemoryScramble';
import { Congratulations } from '../Congratulations';
import { useUser } from '../../context/UserContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const locations = [
  { id: 1, name: 'Memory Match', icon: Terminal },
  { id: 2, name: 'Pointer Quiz', icon: Code },
  { id: 3, name: 'Code Scramble', icon: Book }
];

export const LevelEight: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [score, setScore] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleChallengeComplete = (points: number) => {
    setScore(prev => prev + points);
    if (currentLocation < locations.length - 1) {
      setCurrentLocation(prev => prev + 1);
    } else {
      setShowCongratulations(true);
    }
  };

  const handleContinueAfterCongratulations = () => {
    setShowCongratulations(false);
    setShowCertificate(true);
  };

  const handleReturnToDashboard = () => {
    updateProgress({
      quizPoints: userProgress.quizPoints + score,
      gamePoints: userProgress.gamePoints + score,
      completedLevels: [...new Set([...userProgress.completedLevels, 8])],
      currentLevel: Math.max(userProgress.currentLevel, 9)
    });
    
    navigate('/dashboard');
  };

  const downloadCertificateAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#0a0b1e'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${userProgress.username || 'Student'}-certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

        {!gameStarted && !showCertificate && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Level 8: Pointers & Memory Management</h1>
            
            <div className="aspect-video mb-8 bg-black/30">
              <div className="flex items-center justify-center h-full text-white/50">
                <iframe 
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/IuDJeGqEZ3A"
                  title="Pointers and Memory Management in C"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">What you'll learn:</h2>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Understanding Pointers and Memory Addresses</li>
                <li>Dynamic Memory Allocation (malloc, free)</li>
                <li>Common Memory Management Pitfalls</li>
                <li>Debugging Memory-Related Issues</li>
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

        {gameStarted && !showCongratulations && !showCertificate && (
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
              <MemoryGame onComplete={handleChallengeComplete} />
            )}
            {currentLocation === 1 && (
              <PointerQuiz onComplete={handleChallengeComplete} />
            )}
            {currentLocation === 2 && (
              <MemoryScramble onComplete={handleChallengeComplete} />
            )}
          </div>
        )}

        {showCongratulations && (
          <Congratulations
            title="Level Complete!"
            message="You've mastered pointers and memory management in C!"
            score={score}
            maxScore={300}
            onContinue={handleContinueAfterCongratulations}
          />
        )}

        {showCertificate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 z-50 overflow-y-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-4xl w-full my-8">
              <div 
                ref={certificateRef} 
                className="bg-[#0a0b1e] p-12 rounded-lg relative"
              >
                <div className="border-4 border-purple-500/20 p-8 rounded-lg text-center">
                  <h1 className="text-4xl font-bold text-white mb-8">Certificate of Achievement</h1>
                  
                  <p className="text-xl text-white/70 mb-6">
                    This certifies that
                  </p>
                  
                  <p className="text-3xl font-semibold text-white mb-6">
                    {userProgress.username || 'Student'}
                  </p>
                  
                  <p className="text-xl text-white/70 mb-12">
                    has successfully completed all levels in Learning League
                  </p>
                  
                  <div className="mb-12">
                    <p className="text-white/70 mb-4">Awarded on {today}</p>
                    <p className="text-2xl font-semibold text-white">
                      Total Score: {userProgress.totalPoints} points
                    </p>
                  </div>
                  
                  <p className="text-white/70 text-sm">
                    This certificate recognizes proficiency in C programming fundamentals
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleReturnToDashboard}
                  className="px-6 py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={downloadCertificateAsPDF}
                  className="px-6 py-3 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelEight;