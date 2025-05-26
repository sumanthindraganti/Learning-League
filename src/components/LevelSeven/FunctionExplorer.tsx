import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Star, Zap, AlertTriangle, Trophy, HelpCircle, RefreshCw } from 'lucide-react';

interface FunctionExplorerProps {
  onComplete: (score: number) => void;
}

interface SpaceObject {
  id: string;
  type: 'function' | 'blackhole' | 'booster';
  content: string;
  x: number;
  y: number;
  collected?: boolean;
  category?: 'definition' | 'call' | 'parameter' | 'return';
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  hint: string;
  objects: SpaceObject[];
  targetObjects: string[];
  timeLimit: number;
}

// Define challenges
const challenges: Challenge[] = [
  {
    id: 1,
    title: "Function Assembly",
    description: "Navigate your spaceship to collect all function components in the correct order to build a complete function. Avoid black holes!",
    hint: "Start with the function declaration, then parameters, then body, and finally the return statement",
    objects: [
      { id: "def-1", type: "function", content: "int calculateSum", x: 20, y: 30, category: "definition" },
      { id: "param-1", type: "function", content: "(int a, int b)", x: 70, y: 60, category: "parameter" },
      { id: "body-1", type: "function", content: "{ int result = a + b;", x: 30, y: 70, category: "definition" },
      { id: "return-1", type: "function", content: "return result; }", x: 80, y: 20, category: "return" },
      { id: "bh-1", type: "blackhole", content: "void calculateSum", x: 50, y: 40 },
      { id: "bh-2", type: "blackhole", content: "return a + b;", x: 20, y: 80 },
      { id: "boost-1", type: "booster", content: "hint", x: 60, y: 10 }
    ],
    targetObjects: ["def-1", "param-1", "body-1", "return-1"],
    timeLimit: 60
  },
  {
    id: 2,
    title: "Function Repair",
    description: "Your mission: collect the correct components to repair a broken function. Watch out for incorrect syntax black holes!",
    hint: "The function needs proper parameter passing and return type",
    objects: [
      { id: "def-2", type: "function", content: "void printMessage", x: 30, y: 20, category: "definition" },
      { id: "param-2", type: "function", content: "(char* message)", x: 70, y: 30, category: "parameter" },
      { id: "body-2", type: "function", content: "{ printf(\"%s\\n\", message);", x: 20, y: 60, category: "definition" },
      { id: "return-2", type: "function", content: "return; }", x: 80, y: 70, category: "return" },
      { id: "bh-3", type: "blackhole", content: "int printMessage", x: 50, y: 50 },
      { id: "bh-4", type: "blackhole", content: "return message;", x: 40, y: 80 },
      { id: "boost-2", type: "booster", content: "time", x: 10, y: 40 }
    ],
    targetObjects: ["def-2", "param-2", "body-2", "return-2"],
    timeLimit: 50
  },
  {
    id: 3,
    title: "Function Matching",
    description: "Match the function definition with its correct prototype by collecting the matching components. Avoid mismatched black holes!",
    hint: "Match the function name, parameters, and return type correctly",
    objects: [
      { id: "def-3", type: "function", content: "int findMax", x: 20, y: 20, category: "definition" },
      { id: "param-3", type: "function", content: "(int a, int b)", x: 70, y: 40, category: "parameter" },
      { id: "body-3", type: "function", content: "{ return (a > b) ? a : b; }", x: 30, y: 80, category: "definition" },
      { id: "proto-3", type: "function", content: "int findMax(int a, int b);", x: 80, y: 60, category: "return" },
      { id: "bh-5", type: "blackhole", content: "float findMax(int a, int b);", x: 50, y: 30 },
      { id: "bh-6", type: "blackhole", content: "int findMax(float a, float b);", x: 10, y: 70 },
      { id: "boost-3", type: "booster", content: "score", x: 60, y: 10 }
    ],
    targetObjects: ["def-3", "param-3", "body-3", "proto-3"],
    timeLimit: 55
  }
];

export const FunctionExplorer: React.FC<FunctionExplorerProps> = ({ onComplete }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([]);
  const [collectedObjects, setCollectedObjects] = useState<SpaceObject[]>([]);
  const [shipPosition, setShipPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [activeBoosters, setActiveBoosters] = useState<{
    hint?: boolean;
    time?: boolean;
    score?: boolean;
  }>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Initialize challenge
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const challenge = challenges[currentChallengeIndex];
      setSpaceObjects(challenge.objects.map(obj => ({ ...obj, collected: false })));
      setCollectedObjects([]);
      setTimeLeft(challenge.timeLimit);
      setActiveBoosters({});
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, currentChallengeIndex, gameOver]);

  // Handle ship movement with keyboard
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 10;
      const gameArea = gameAreaRef.current;
      if (!gameArea) return;
      
      const bounds = {
        width: gameArea.clientWidth,
        height: gameArea.clientHeight
      };
      
      switch (e.key) {
        case 'ArrowUp':
          setShipPosition(prev => ({
            ...prev,
            y: Math.max(0, prev.y - speed)
          }));
          break;
        case 'ArrowDown':
          setShipPosition(prev => ({
            ...prev,
            y: Math.min(bounds.height - 40, prev.y + speed)
          }));
          break;
        case 'ArrowLeft':
          setShipPosition(prev => ({
            ...prev,
            x: Math.max(0, prev.x - speed)
          }));
          break;
        case 'ArrowRight':
          setShipPosition(prev => ({
            ...prev,
            x: Math.min(bounds.width - 40, prev.x + speed)
          }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  // Check for collisions
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const checkCollisions = () => {
      const ship = shipRef.current;
      if (!ship) return;
      
      const shipRect = ship.getBoundingClientRect();
      
      spaceObjects.forEach(obj => {
        if (obj.collected) return;
        
        const objElement = document.getElementById(`space-obj-${obj.id}`);
        if (!objElement) return;
        
        const objRect = objElement.getBoundingClientRect();
        
        // Check for collision
        if (
          shipRect.left < objRect.right &&
          shipRect.right > objRect.left &&
          shipRect.top < objRect.bottom &&
          shipRect.bottom > objRect.top
        ) {
          handleCollision(obj);
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(checkCollisions);
    };
    
    animationFrameRef.current = requestAnimationFrame(checkCollisions);
    
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameStarted, gameOver, spaceObjects]);

  const handleCollision = (obj: SpaceObject) => {
    // Mark object as collected
    setSpaceObjects(prev => 
      prev.map(o => o.id === obj.id ? { ...o, collected: true } : o)
    );
    
    if (obj.type === 'function') {
      // Add to collected objects
      setCollectedObjects(prev => [...prev, obj]);
      setScore(prev => prev + 10);
      setFeedback(`Collected: ${obj.content}`);
      
      // Check if all target objects are collected
      const challenge = challenges[currentChallengeIndex];
      const collectedIds = [...collectedObjects.map(o => o.id), obj.id];
      const allTargetsCollected = challenge.targetObjects.every(id => 
        collectedIds.includes(id)
      );
      
      if (allTargetsCollected) {
        // Calculate bonus points based on time left
        const timeBonus = timeLeft * 2;
        const challengeScore = 50 + timeBonus + (activeBoosters.score ? 30 : 0);
        setScore(prev => prev + challengeScore);
        
        setFeedback(`🎉 Challenge completed! +${challengeScore} points`);
        
        // Move to next challenge or complete game
        setTimeout(() => {
          if (currentChallengeIndex < challenges.length - 1) {
            setCurrentChallengeIndex(prev => prev + 1);
            setFeedback('');
          } else {
            setGameCompleted(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setTimeout(() => onComplete(score + challengeScore), 3000);
          }
        }, 2000);
      }
    } else if (obj.type === 'blackhole') {
      // Penalty for hitting a black hole
      setScore(prev => Math.max(0, prev - 15));
      setFeedback(`⚠️ Hit a black hole: ${obj.content}`);
      
      // Reset ship position
      setShipPosition({ x: 50, y: 50 });
    } else if (obj.type === 'booster') {
      // Apply booster effect
      if (obj.content === 'hint') {
        setActiveBoosters(prev => ({ ...prev, hint: true }));
        setShowHint(true);
        setFeedback('💡 Hint booster activated!');
      } else if (obj.content === 'time') {
        setActiveBoosters(prev => ({ ...prev, time: true }));
        setTimeLeft(prev => prev + 15);
        setFeedback('⏱️ Time booster activated! +15 seconds');
      } else if (obj.content === 'score') {
        setActiveBoosters(prev => ({ ...prev, score: true }));
        setFeedback('🏆 Score booster activated! +30 bonus points');
      }
    }
    
    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(''), 3000);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setShipPosition({ x: 50, y: 50 });
  };

  const resetChallenge = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const challenge = challenges[currentChallengeIndex];
    setSpaceObjects(challenge.objects.map(obj => ({ ...obj, collected: false })));
    setCollectedObjects([]);
    setTimeLeft(challenge.timeLimit);
    setShipPosition({ x: 50, y: 50 });
    setActiveBoosters({});
    setFeedback('');
    
    // Restart timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Function Explorer</h2>
          <p className="text-white/70 mb-6">
            Congratulations on completing the challenges! Now navigate through the galaxy of functions in this mini-game.
          </p>
        </div>
        
        <div className="bg-blue-500/20 p-6 rounded-lg mb-8 text-left">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Mission Briefing:</h3>
          <ul className="list-disc list-inside text-blue-200 space-y-2">
            <li>Pilot your spaceship through the galactic maze using arrow keys</li>
            <li>Collect function components (green) to complete your mission</li>
            <li>Avoid black holes (red) that contain incorrect code</li>
            <li>Collect power-ups (blue) for special abilities</li>
            <li>Complete all missions to win</li>
            <li>Faster completion earns more points!</li>
          </ul>
        </div>
        
        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
        >
          <Rocket className="w-5 h-5" />
          Launch Mission
        </button>
      </div>
    );
  }

  const challenge = challenges[currentChallengeIndex];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{challenge.title}</h2>
          <p className="text-white/70">{challenge.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className={`${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
          <div className="text-white">
            Mission: <span className="font-bold">{currentChallengeIndex + 1}/{challenges.length}</span>
          </div>
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {activeBoosters.hint && <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm">💡 Hint Active</span>}
          {activeBoosters.time && <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm">⏱️ Time Boost</span>}
          {activeBoosters.score && <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm">🏆 Score Boost</span>}
        </div>
        
        <div className="bg-black/50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Mission Objective:</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.targetObjects.map((targetId) => {
              const obj = challenge.objects.find(o => o.id === targetId);
              const isCollected = collectedObjects.some(o => o.id === targetId);
              
              return (
                <div 
                  key={targetId}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isCollected ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {isCollected && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  {obj?.content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative w-full h-[400px] bg-[#0a0b1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] rounded-lg overflow-hidden border border-white/10 mb-4"
      >
        {/* Space objects */}
        {spaceObjects.map((obj) => !obj.collected && (
          <div
            id={`space-obj-${obj.id}`}
            key={obj.id}
            className={`absolute transition-all ${
              obj.type === 'function' ? 'text-green-400' : 
              obj.type === 'blackhole' ? 'text-red-400' : 
              'text-blue-400'
            }`}
            style={{ 
              left: `${obj.x}%`, 
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              obj.type === 'function' ? 'bg-green-500/20 animate-pulse' : 
              obj.type === 'blackhole' ? 'bg-red-500/20 animate-spin' : 
              'bg-blue-500/20 animate-bounce'
            }`}>
              {obj.type === 'function' ? <Code className="w-6 h-6" /> : 
               obj.type === 'blackhole' ? <AlertTriangle className="w-6 h-6" /> : 
               <Zap className="w-6 h-6" />}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs mt-1 px-2 py-1 rounded bg-black/50">
              {obj.content}
            </div>
          </div>
        ))}
        
        {/* Stars background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Spaceship */}
        <div
          ref={shipRef}
          className="absolute w-10 h-10 transition-all duration-100"
          style={{ 
            left: `${shipPosition.x}%`, 
            top: `${shipPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Rocket className="w-10 h-10 text-purple-400 transform rotate-90" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={resetChallenge}
            className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Mission
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>
        
        <div className="text-white/70 text-sm">
          Use arrow keys to navigate
        </div>
      </div>

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg ${
          feedback.includes('🎉') ? 'bg-green-500/20 text-green-400' : 
          feedback.includes('⚠️') ? 'bg-red-500/20 text-red-400' :
          'bg-blue-500/20 text-blue-300'
        }`}>
          {feedback}
        </div>
      )}

      {(showHint || activeBoosters.hint) && (
        <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
          <p className="text-blue-300">💡 Hint: {challenge.hint}</p>
        </div>
      )}

      {gameOver && !gameCompleted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Mission Failed</h2>
            <p className="text-white/70 mb-6">You ran out of time! Try again?</p>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Score:</span>
                <span className="text-2xl font-bold text-white">{score}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={resetChallenge}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <button
                onClick={() => onComplete(score)}
                className="flex-1 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              >
                End Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {gameCompleted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Mission Complete!</h2>
            <p className="text-white/70 mb-6">You've successfully navigated the galaxy of functions!</p>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Final Score:</span>
                <span className="text-2xl font-bold text-white">{score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Missions Completed:</span>
                <span className="text-white font-semibold">{challenges.length}/{challenges.length}</span>
              </div>
            </div>
            
            <p className="text-green-400 animate-pulse mb-6">
              Level 7 Complete! Moving to Level 8...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add CSS for star animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  
  .animate-twinkle {
    animation: twinkle 3s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);