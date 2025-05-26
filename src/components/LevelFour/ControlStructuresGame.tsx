import React, { useState, useEffect } from 'react';
import { Play, Trophy, Code, CheckCircle } from 'lucide-react';

interface ControlStructuresGameProps {
  onComplete: (score: number) => void;
}

interface Challenge {
  code: string;
  correctOrder: string[];
  hint: string;
}

const challenges: Challenge[] = [
  {
    code: `if (x > 10) {
    printf("Greater");
} else {
    printf("Lesser");
}`,
    correctOrder: ['if', 'condition', 'print', 'else', 'print'],
    hint: "Start with the if keyword, then condition"
  },
  {
    code: `for (i = 0; i < 5; i++) {
    printf("%d", i);
}`,
    correctOrder: ['for', 'init', 'condition', 'increment', 'print'],
    hint: "Initialize counter first, then condition"
  },
  {
    code: `switch (choice) {
    case 1:
        printf("One");
        break;
    default:
        printf("Other");
}`,
    correctOrder: ['switch', 'case', 'print', 'break', 'default'],
    hint: "Begin with switch, then cases"
  }
];

export const ControlStructuresGame: React.FC<ControlStructuresGameProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const parts = [...challenges[currentChallenge].correctOrder];
      setAvailableParts(parts.sort(() => Math.random() - 0.5));
      setSelectedParts([]);
    }
  }, [currentChallenge, gameStarted]);

  const handlePartClick = (part: string) => {
    if (availableParts.includes(part)) {
      setSelectedParts([...selectedParts, part]);
      setAvailableParts(availableParts.filter(p => p !== part));
    } else {
      setAvailableParts([...availableParts, part]);
      setSelectedParts(selectedParts.filter(p => p !== part));
    }
  };

  const checkOrder = () => {
    const isCorrect = selectedParts.every(
      (part, index) => part === challenges[currentChallenge].correctOrder[index]
    );

    if (isCorrect) {
      setScore(prev => prev + 10);
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
      } else {
        setTimeout(() => onComplete(score + 10), 1500);
      }
    } else {
      setSelectedParts([]);
      setAvailableParts([...challenges[currentChallenge].correctOrder].sort(() => Math.random() - 0.5));
    }
  };

  if (!gameStarted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Control Structures Challenge</h2>
        <p className="text-white/70 mb-8">
          Arrange the code parts in the correct order to complete each control structure!
        </p>
        <button
          onClick={() => setGameStarted(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
        >
          <Play className="w-5 h-5" />
          Start Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Control Structures Challenge</h2>
        <div className="flex items-center gap-4">
          <div className="text-white">
            Challenge: <span className="font-bold">{currentChallenge + 1}/{challenges.length}</span>
          </div>
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="bg-black/30 p-6 rounded-lg mb-6">
        <pre className="text-green-400 font-mono">{challenges[currentChallenge].code}</pre>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Selected Parts:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedParts.map((part, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handlePartClick(part)}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Available Parts:</h3>
          <div className="flex flex-wrap gap-2">
            {availableParts.map((part, index) => (
              <button
                key={`available-${index}`}
                onClick={() => handlePartClick(part)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={checkOrder}
            disabled={selectedParts.length !== challenges[currentChallenge].correctOrder.length}
            className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold transition-opacity flex items-center gap-2 ${
              selectedParts.length !== challenges[currentChallenge].correctOrder.length
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Check Order
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>

        {showHint && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">💡 Hint: {challenges[currentChallenge].hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};