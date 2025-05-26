import React, { useState, useEffect } from 'react';
import { Code, CheckCircle, HelpCircle } from 'lucide-react';

interface CodeSnippet {
  id: string;
  content: string;
  order: number;
}

interface Program {
  id: number;
  name: string;
  description: string;
  snippets: CodeSnippet[];
  hint: string;
}

interface ChallengeAttempt {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
}

interface CodeScrambleProps {
  onComplete: (points: number, correctCount: number, challengeData: ChallengeAttempt) => void;
}

const programs: Program[] = [
  {
    id: 1,
    name: "Function Declaration",
    description: "Arrange the code to create a function that calculates the sum of two numbers",
    snippets: [
      { id: "1-1", content: "int add(int a, int b) {", order: 0 },
      { id: "1-2", content: "    int result;", order: 1 },
      { id: "1-3", content: "    result = a + b;", order: 2 },
      { id: "1-4", content: "    return result;", order: 3 },
      { id: "1-5", content: "}", order: 4 }
    ],
    hint: "Start with function declaration, then variable, calculation, and return"
  },
  {
    id: 2,
    name: "Function Call",
    description: "Arrange the code to call a function and print its result",
    snippets: [
      { id: "2-1", content: "int x = 5, y = 3;", order: 0 },
      { id: "2-2", content: "int sum;", order: 1 },
      { id: "2-3", content: "sum = add(x, y);", order: 2 },
      { id: "2-4", content: 'printf("Sum: %d\\n", sum);', order: 3 }
    ],
    hint: "Declare variables first, then call function, then print"
  },
  {
    id: 3,
    name: "Recursive Function",
    description: "Arrange the code to create a recursive factorial function",
    snippets: [
      { id: "3-1", content: "int factorial(int n) {", order: 0 },
      { id: "3-2", content: "    if (n == 0 || n == 1)", order: 1 },
      { id: "3-3", content: "        return 1;", order: 2 },
      { id: "3-4", content: "    return n * factorial(n - 1);", order: 3 },
      { id: "3-5", content: "}", order: 4 }
    ],
    hint: "Start with function declaration, then base case, then recursive case"
  },
  {
    id: 4,
    name: "Temperature Converter",
    description: "Arrange the code to create a function that converts Celsius to Fahrenheit",
    snippets: [
      { id: "4-1", content: "float celsiusToFahrenheit(float celsius) {", order: 0 },
      { id: "4-2", content: "    float fahrenheit;", order: 1 },
      { id: "4-3", content: "    fahrenheit = (celsius * 9/5) + 32;", order: 2 },
      { id: "4-4", content: "    return fahrenheit;", order: 3 },
      { id: "4-5", content: "}", order: 4 }
    ],
    hint: "Function declaration first, then variable, conversion formula, and return"
  }
];

export const CodeScramble: React.FC<CodeScrambleProps> = ({ onComplete }) => {
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [draggedSnippet, setDraggedSnippet] = useState<CodeSnippet | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Randomly select 3 programs
    const shuffled = [...programs].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setSelectedPrograms(selected);
    
    // Set up first program
    const shuffledSnippets = [...selected[0].snippets].sort(() => 0.5 - Math.random());
    setSnippets(shuffledSnippets);
  }, []);

  const handleDragStart = (e: React.DragEvent, snippet: CodeSnippet) => {
    setDraggedSnippet(snippet);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedSnippet(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-purple-500/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-purple-500/20');
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-purple-500/20');

    if (!draggedSnippet) return;

    const sourceIndex = snippets.findIndex(s => s.id === draggedSnippet.id);
    if (sourceIndex === targetIndex) return;

    const newSnippets = [...snippets];
    newSnippets.splice(sourceIndex, 1);
    newSnippets.splice(targetIndex, 0, draggedSnippet);
    setSnippets(newSnippets);
  };

  const checkOrder = () => {
    const currentProgram = selectedPrograms[currentProgramIndex];
    const isCorrect = snippets.every((snippet, index) => 
      snippet.order === index
    );

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Create challenge attempt data
    const challengeData: ChallengeAttempt = {
      question: currentProgram.description,
      correctAnswer: currentProgram.snippets.map(s => s.content).join('\n'),
      userAnswer: snippets.map(s => s.content).join('\n'),
      isCorrect: isCorrect,
      attempts: newAttempts
    };

    if (isCorrect) {
      const newScore = Math.max(20 - attempts * 2, 10); // Score based on attempts
      setScore(prev => prev + newScore);
      setFeedback({ message: 'Correct! Moving to next challenge...', type: 'success' });

      setTimeout(() => {
        if (currentProgramIndex === selectedPrograms.length - 1) {
          // All programs completed
          onComplete(score + newScore, 1, challengeData);
        } else {
          // Move to next program
          setCurrentProgramIndex(prev => prev + 1);
          setSnippets([...selectedPrograms[currentProgramIndex + 1].snippets].sort(() => 0.5 - Math.random()));
          setAttempts(0);
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback({ message: 'Not quite right. Try again!', type: 'error' });
      
      // If max attempts reached, complete with failure
      if (newAttempts >= 3) {
        onComplete(score, 0, challengeData);
      }
    }
  };

  const currentProgram = selectedPrograms[currentProgramIndex];
  if (!currentProgram) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{currentProgram.name}</h2>
          <p className="text-white/70">{currentProgram.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white">
            Challenge: <span className="font-bold">{currentProgramIndex + 1}/3</span>
          </div>
          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {snippets.map((snippet, index) => (
          <div
            key={snippet.id}
            draggable
            onDragStart={(e) => handleDragStart(e, snippet)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex-1 bg-black/30 p-4 rounded-lg font-mono text-white transition-all cursor-move hover:bg-black/40 ${
              draggedSnippet === snippet ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              {snippet.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={checkOrder}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Check Order
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
          {attempts > 0 && (
            <p className="text-white/70">
              Attempts: <span className="font-bold">{attempts}</span>
            </p>
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg ${
            feedback.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback.message}
          </div>
        )}

        {showHint && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">💡 Hint: {currentProgram.hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};