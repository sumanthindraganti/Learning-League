import React, { useState, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';

interface CodingChallengeProps {
  locationIndex: number;
  onComplete: (points: number, correctCount: number, challengeData: ChallengeAttempt) => void;
}

interface ChallengeAttempt {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
}

interface Challenge {
  id: number;
  question: string;
  initialCode: string;
  solutions: string[];
  hint: string;
  expectedOutput?: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    question: "Complete the program to print 'Hello, World!'",
    initialCode: `#include <stdio.h>
int main() {
    // Add your code here
    
    return 0;
}`,
    solutions: [
      `printf("Hello, World!");`,
      `printf("Hello, World!\\n");`,
      `puts("Hello, World!");`,
      `fprintf(stdout, "Hello, World!");`
    ],
    expectedOutput: "Hello, World!",
    hint: "Use printf() or puts() to display text"
  },
  {
    id: 2,
    question: "Declare an integer variable 'num' and assign it the value 10",
    initialCode: `// Add your declaration here
`,
    solutions: [
      `int num = 10;`,
      `int num=10;`,
      `int num=10 ;`,
      `int num; num = 10;`
    ],
    expectedOutput: "int num = 10",
    hint: "Use 'int' keyword followed by variable name and value"
  },
  {
    id: 3,
    question: "Write a statement to take an integer input from the user",
    initialCode: `int number;
// Add your input statement here
`,
    solutions: [
      `scanf("%d", &number);`,
      `scanf("%d",&number);`,
      `scanf("%i", &number);`,
      `fscanf(stdin, "%d", &number);`
    ],
    expectedOutput: "scanf input for integer",
    hint: "Use scanf() with %d format specifier and & operator"
  }
];

const normalizeCode = (code: string): string => {
  return code
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;()])\s*/g, '$1')
    .toLowerCase();
};

const checkFunctionalEquivalence = (userCode: string, challenge: Challenge): boolean => {
  const normalizedUserCode = normalizeCode(userCode);
  
  const containsSolution = challenge.solutions.some(solution => 
    normalizedUserCode.includes(normalizeCode(solution))
  );
  
  if (containsSolution) return true;
  
  if (challenge.expectedOutput) {
    const expectedOutput = challenge.expectedOutput.toLowerCase();
    
    if (expectedOutput === "hello, world!") {
      if (normalizedUserCode.includes('printf') && 
          (normalizedUserCode.includes('"hello, world!"') || 
           normalizedUserCode.includes('"hello world"') || 
           normalizedUserCode.includes('"hello, world!\\n"'))) {
        return true;
      }
      if (normalizedUserCode.includes('puts')) {
        if (normalizedUserCode.includes('"hello, world!"') || 
            normalizedUserCode.includes('"hello world"')) {
          return true;
        }
      }
    }
    
    if (expectedOutput === "int num = 10") {
      if (normalizedUserCode.includes('int') && 
          normalizedUserCode.includes('num') && 
          normalizedUserCode.includes('10')) {
        return true;
      }
    }
    
    if (expectedOutput === "scanf input for integer") {
      if (normalizedUserCode.includes('scanf') && 
          (normalizedUserCode.includes('"%d"') || normalizedUserCode.includes('"%i"')) && 
          normalizedUserCode.includes('&number')) {
        return true;
      }
    }
  }
  
  return false;
};

export const CodingChallenge: React.FC<CodingChallengeProps> = ({
  locationIndex,
  onComplete
}) => {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<string>('');
  const [shouldComplete, setShouldComplete] = useState(false);
  const MAX_SUBMISSIONS = 3;

  useEffect(() => {
    if (selectedChallenges.length === 0) {
      const shuffled = [...challenges].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setSelectedChallenges(selected);
    }

    if (selectedChallenges.length > 0 && locationIndex < selectedChallenges.length) {
      const challenge = selectedChallenges[locationIndex];
      setSelectedChallenge(challenge);
      setCode(challenge.initialCode || '');
      setIsSubmitting(false);
      setFeedback('');
      setSubmissionCount(0);
      setLastAttempt('');
      setShowHint(false);
      setShouldComplete(false);
    }
  }, [locationIndex, selectedChallenges]);

  useEffect(() => {
    if (shouldComplete && selectedChallenge) {
      const challengeData: ChallengeAttempt = {
        question: selectedChallenge.question,
        correctAnswer: selectedChallenge.solutions[0],
        userAnswer: code,
        isCorrect: false,
        attempts: MAX_SUBMISSIONS
      };
      
      onComplete(0, correctAnswers, challengeData);
      setShouldComplete(false);
    }
  }, [shouldComplete, selectedChallenge, code, correctAnswers, onComplete]);

  const handleSubmit = () => {
    if (!selectedChallenge || isSubmitting || submissionCount >= MAX_SUBMISSIONS) return;
    
    const newSubmissionCount = submissionCount + 1;
    setSubmissionCount(newSubmissionCount);
    setIsSubmitting(true);
    setLastAttempt(code);
    
    const isCorrect = checkFunctionalEquivalence(code, selectedChallenge);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback('Correct! Moving to next location...');
      
      const challengeData: ChallengeAttempt = {
        question: selectedChallenge.question,
        correctAnswer: selectedChallenge.solutions[0],
        userAnswer: code,
        isCorrect: true,
        attempts: newSubmissionCount
      };
      
      setTimeout(() => {
        onComplete(10, correctAnswers + 1, challengeData);
        setIsSubmitting(false);
      }, 1500);
    } else {
      const attemptsLeft = MAX_SUBMISSIONS - newSubmissionCount;
      setFeedback(`Not quite right. ${attemptsLeft > 0 ? `${attemptsLeft} attempts remaining.` : 'Last attempt!'}`);
      setShowHint(true);
      setIsSubmitting(false);

      if (newSubmissionCount >= MAX_SUBMISSIONS) {
        setFeedback('Maximum attempts reached. Moving to next question...');
        setTimeout(() => {
          setShouldComplete(true);
        }, 1500);
      }
    }
  };

  if (!selectedChallenge) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Coding Challenge</h2>
        <p className="text-white/70">{selectedChallenge.question}</p>
      </div>

      <div className="mb-6">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 bg-black/30 text-white font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          spellCheck="false"
          disabled={isSubmitting || submissionCount >= MAX_SUBMISSIONS}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || submissionCount >= MAX_SUBMISSIONS}
            className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold transition-opacity flex items-center gap-2 ${
              isSubmitting || submissionCount >= MAX_SUBMISSIONS ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <Check className="w-5 h-5" />
            Submit {submissionCount > 0 ? `(${submissionCount}/${MAX_SUBMISSIONS})` : ''}
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-white/20 rounded-lg text-white font-semibold transition-opacity ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>
        {feedback && (
          <p className={`font-semibold ${
            feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'
          }`}>
            {feedback}
          </p>
        )}
      </div>

      {showHint && (
        <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
          <p className="text-blue-300">💡 Hint: {selectedChallenge.hint}</p>
        </div>
      )}
    </div>
  );
};