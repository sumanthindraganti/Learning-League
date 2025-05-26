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

const programs: Program[] = [
  {
    id: 1,
    name: "Hello World Program",
    description: "Arrange the code to print 'Hello, World!'",
    snippets: [
      { id: "1-1", content: "#include <stdio.h>", order: 0 },
      { id: "1-2", content: "int main() {", order: 1 },
      { id: "1-3", content: '    printf("Hello, World!\\n");', order: 2 },
      { id: "1-4", content: "    return 0;", order: 3 },
      { id: "1-5", content: "}", order: 4 }
    ],
    hint: "Start with header, then main function, printf, return, and closing brace"
  },
  {
    id: 2,
    name: "Variable Declaration",
    description: "Arrange the code to declare and initialize variables",
    snippets: [
      { id: "2-1", content: "int age;", order: 0 },
      { id: "2-2", content: "age = 25;", order: 1 },
      { id: "2-3", content: 'printf("Age: %d\\n", age);', order: 2 }
    ],
    hint: "First declare variable, then assign value, finally print"
  },
  {
    id: 3,
    name: "Basic Input",
    description: "Arrange the code to get user input",
    snippets: [
      { id: "3-1", content: "int number;", order: 0 },
      { id: "3-2", content: 'printf("Enter a number: ");', order: 1 },
      { id: "3-3", content: "scanf(\"%d\", &number);", order: 2 }
    ],
    hint: "Declare variable, prompt user, then read input"
  },
  {
    id: 4,
    name: "Basic Arithmetic",
    description: "Arrange the code to perform addition",
    snippets: [
      { id: "4-1", content: "int a = 5, b = 3;", order: 0 },
      { id: "4-2", content: "int sum = a + b;", order: 1 },
      { id: "4-3", content: 'printf("Sum: %d\\n", sum);', order: 2 }
    ],
    hint: "First declare variables, then calculate sum, finally print result"
  },
  {
    id: 5,
    name: "Character Operations",
    description: "Arrange the code to work with characters",
    snippets: [
      { id: "5-1", content: "char letter = 'A';", order: 0 },
      { id: "5-2", content: 'printf("Character: %c\\n", letter);', order: 1 },
      { id: "5-3", content: 'printf("ASCII: %d\\n", letter);', order: 2 }
    ],
    hint: "Declare character, print character, then print ASCII value"
  },
  {
    id: 6,
    name: "Type Conversion",
    description: "Arrange the code to demonstrate type conversion",
    snippets: [
      { id: "6-1", content: "int num = 42;", order: 0 },
      { id: "6-2", content: "float result = (float)num / 10;", order: 1 },
      { id: "6-3", content: 'printf("Result: %.1f\\n", result);', order: 2 }
    ],
    hint: "Declare integer, convert to float, then print result"
  },
  {
    id: 7,
    name: "Multiple Variables",
    description: "Arrange the code to work with multiple variables",
    snippets: [
      { id: "7-1", content: "int x = 10, y = 20;", order: 0 },
      { id: "7-2", content: "int temp = x;", order: 1 },
      { id: "7-3", content: "x = y;", order: 2 },
      { id: "7-4", content: "y = temp;", order: 3 }
    ],
    hint: "Declare variables, use temp variable for swapping"
  },
  {
    id: 8,
    name: "Basic Output",
    description: "Arrange the code to format output",
    snippets: [
      { id: "8-1", content: "int count = 100;", order: 0 },
      { id: "8-2", content: "float price = 9.99;", order: 1 },
      { id: "8-3", content: 'printf("Count: %d, Price: $%.2f\\n", count, price);', order: 2 }
    ],
    hint: "Declare variables, then use format specifiers in printf"
  },
  {
    id: 9,
    name: "Constants",
    description: "Arrange the code to work with constants",
    snippets: [
      { id: "9-1", content: "#define PI 3.14159", order: 0 },
      { id: "9-2", content: "float radius = 5.0;", order: 1 },
      { id: "9-3", content: "float area = PI * radius * radius;", order: 2 }
    ],
    hint: "Define constant first, then declare variables and calculate"
  },
  {
    id: 10,
    name: "Basic Math",
    description: "Arrange the code to perform basic math operations",
    snippets: [
      { id: "10-1", content: "int x = 15;", order: 0 },
      { id: "10-2", content: "int square = x * x;", order: 1 },
      { id: "10-3", content: "int cube = square * x;", order: 2 }
    ],
    hint: "Calculate square first, then use it to find cube"
  }
];

interface CodeJumbleChallengeProps {
  onComplete: (score: number) => void;
}

export const CodeJumbleChallenge: React.FC<CodeJumbleChallengeProps> = ({ onComplete }) => {
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [draggedSnippet, setDraggedSnippet] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Randomly select 5 programs
    const shuffled = [...programs].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setSelectedPrograms(selected);
    
    // Set up first program
    const shuffledSnippets = [...selected[0].snippets].sort(() => 0.5 - Math.random());
    setSnippets(shuffledSnippets);
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedSnippet(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSnippet === null) return;

    const newSnippets = [...snippets];
    const [draggedItem] = newSnippets.splice(draggedSnippet, 1);
    newSnippets.splice(index, 0, draggedItem);
    setSnippets(newSnippets);
    setDraggedSnippet(index);
  };

  const handleDragEnd = () => {
    setDraggedSnippet(null);
  };

  const checkOrder = () => {
    const currentProgram = selectedPrograms[currentProgramIndex];
    const isCorrect = snippets.every((snippet, index) => 
      snippet.order === index
    );

    if (isCorrect) {
      const newScore = Math.max(20 - attempts * 2, 10); // Score based on attempts
      setScore(prev => prev + newScore);
      setFeedback({ message: 'Correct! Moving to next challenge...', type: 'success' });

      setTimeout(() => {
        if (currentProgramIndex === selectedPrograms.length - 1) {
          // All programs completed
          onComplete(score + newScore);
        } else {
          // Move to next program
          setCurrentProgramIndex(prev => prev + 1);
          setSnippets([...selectedPrograms[currentProgramIndex + 1].snippets].sort(() => 0.5 - Math.random()));
          setAttempts(0);
          setFeedback(null);
        }
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      setFeedback({ message: 'Not quite right. Try again!', type: 'error' });
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
            Challenge: <span className="font-bold">{currentProgramIndex + 1}/5</span>
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
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex-1 bg-black/30 p-4 rounded-lg font-mono text-white transition-all cursor-move hover:bg-black/40 ${
              draggedSnippet === index ? 'opacity-50' : ''
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