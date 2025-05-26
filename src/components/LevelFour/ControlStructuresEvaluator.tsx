import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, HelpCircle } from 'lucide-react';
import { CodeEditor } from '../CodeEditor';

interface Challenge {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  expectedOutput: string;
  hint: string;
  testCases: {
    input: string[];
    output: string[];
  }[];
  validationRules: {
    requiredPatterns: string[];
    forbiddenPatterns: string[];
  };
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Loop Challenge",
    description: "Write a program using a for loop to print numbers from 1 to 5",
    initialCode: `#include <stdio.h>

int main() {
    // Write your loop here
    
    return 0;
}`,
    expectedOutput: "1\n2\n3\n4\n5",
    hint: "Use a for loop with i starting from 1 and going up to 5",
    testCases: [
      {
        input: [],
        output: ["1", "2", "3", "4", "5"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "for",
        "printf",
        "1",
        "5"
      ],
      forbiddenPatterns: []
    }
  },
  {
    id: 2,
    title: "If-Else Challenge",
    description: "Write a program that prints 'Even' if a number is even, and 'Odd' if it's odd",
    initialCode: `#include <stdio.h>

int main() {
    int num = 4;
    // Write your if-else statement here
    
    return 0;
}`,
    expectedOutput: "Even",
    hint: "Use the modulo operator (%) to check if a number is even",
    testCases: [
      {
        input: [],
        output: ["Even"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "if",
        "else",
        "printf",
        "%"
      ],
      forbiddenPatterns: []
    }
  },
  {
    id: 3,
    title: "While Loop Challenge",
    description: "Write a program that prints numbers from 5 down to 1 using a while loop",
    initialCode: `#include <stdio.h>

int main() {
    // Write your while loop here
    
    return 0;
}`,
    expectedOutput: "5\n4\n3\n2\n1",
    hint: "Initialize a counter to 5 and decrement it in the while loop",
    testCases: [
      {
        input: [],
        output: ["5", "4", "3", "2", "1"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "while",
        "printf",
        "--"
      ],
      forbiddenPatterns: []
    }
  }
];

interface ControlStructuresEvaluatorProps {
  onComplete: (score: number) => void;
}

const ControlStructuresEvaluator: React.FC<ControlStructuresEvaluatorProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shouldComplete, setShouldComplete] = useState(false);
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    // Randomly select 3 challenges
    const shuffled = [...challenges].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setSelectedChallenges(selected);
    setCurrentChallenge(selected[0]);
  }, []);

  useEffect(() => {
    if (shouldComplete && currentChallenge) {
      onComplete(30);
      setShouldComplete(false);
    }
  }, [shouldComplete, currentChallenge, onComplete]);

  const handleCorrect = () => {
    setFeedback('✨ Great job! Moving to next challenge...');
    setTimeout(() => {
      if (challengeIndex < selectedChallenges.length - 1) {
        setChallengeIndex(prev => prev + 1);
        setCurrentChallenge(selectedChallenges[challengeIndex + 1]);
        setFeedback('');
        setShowHint(false);
        setAttempts(0);
      } else {
        onComplete(30);
      }
    }, 2000);
  };

  const handleIncorrect = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setFeedback('Maximum attempts reached. Moving to next challenge...');
      setTimeout(() => {
        if (challengeIndex < selectedChallenges.length - 1) {
          setChallengeIndex(prev => prev + 1);
          setCurrentChallenge(selectedChallenges[challengeIndex + 1]);
          setFeedback('');
          setShowHint(false);
          setAttempts(0);
        } else {
          setShouldComplete(true);
        }
      }, 2000);
    } else {
      setFeedback(`❌ Not quite right. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      setShowHint(true);
    }
  };

  if (!currentChallenge) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h2>
        <p className="text-white/70">{currentChallenge.description}</p>
      </div>

      <CodeEditor 
        initialCode={currentChallenge.initialCode}
        height="400px"
        expectedOutput={currentChallenge.expectedOutput}
        onCorrect={handleCorrect}
        onExecute={() => handleIncorrect()}
      />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        <div className="text-white">
          Challenge: <span className="font-bold">{challengeIndex + 1}/{selectedChallenges.length}</span>
        </div>
      </div>

      {showHint && (
        <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
          <p className="text-blue-300">💡 Hint: {currentChallenge.hint}</p>
        </div>
      )}

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg ${
          feedback.includes('✨') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default ControlStructuresEvaluator;