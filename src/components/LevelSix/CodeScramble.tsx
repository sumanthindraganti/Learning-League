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
    name: "Array Initialization",
    description: "Arrange the code to initialize and print an array",
    snippets: [
      { id: "1-1", content: "int arr[5] = {10, 20, 30, 40, 50};", order: 0 },
      { id: "1-2", content: "printf(\"Array elements: \");", order: 1 },
      { id: "1-3", content: "for(int i = 0; i < 5; i++) {", order: 2 },
      { id: "1-4", content: "    printf(\"%d \", arr[i]);", order: 3 },
      { id: "1-5", content: "}", order: 4 }
    ],
    hint: "First declare the array, then print a message, then loop through elements"
  },
  {
    id: 2,
    name: "Find Largest Element",
    description: "Arrange the code to find the largest element in an array",
    snippets: [
      { id: "2-1", content: "int arr[] = {23, 45, 12, 67, 34};", order: 0 },
      { id: "2-2", content: "int max = arr[0];", order: 1 },
      { id: "2-3", content: "for(int i = 1; i < 5; i++) {", order: 2 },
      { id: "2-4", content: "    if(arr[i] > max) {", order: 3 },
      { id: "2-5", content: "        max = arr[i];", order: 4 },
      { id: "2-6", content: "    }", order: 5 },
      { id: "2-7", content: "}", order: 6 },
      { id: "2-8", content: "printf(\"Largest element: %d\", max);", order: 7 }
    ],
    hint: "Initialize array, set max to first element, then loop and compare each element"
  },
  {
    id: 3,
    name: "Sum Array Elements",
    description: "Arrange the code to calculate the sum of array elements",
    snippets: [
      { id: "3-1", content: "int numbers[] = {5, 10, 15, 20, 25};", order: 0 },
      { id: "3-2", content: "int sum = 0;", order: 1 },
      { id: "3-3", content: "for(int i = 0; i < 5; i++) {", order: 2 },
      { id: "3-4", content: "    sum += numbers[i];", order: 3 },
      { id: "3-5", content: "}", order: 4 },
      { id: "3-6", content: "printf(\"Sum of elements: %d\", sum);", order: 5 }
    ],
    hint: "First declare array, initialize sum to zero, then loop through elements adding to sum"
  },
  {
    id: 4,
    name: "Sort Array",
    description: "Arrange the code to sort an array in ascending order",
    snippets: [
      { id: "4-1", content: "int data[] = {64, 25, 12, 22, 11};", order: 0 },
      { id: "4-2", content: "for(int i = 0; i < 4; i++) {", order: 1 },
      { id: "4-3", content: "    for(int j = 0; j < 4-i; j++) {", order: 2 },
      { id: "4-4", content: "        if(data[j] > data[j+1]) {", order: 3 },
      { id: "4-5", content: "            int temp = data[j];", order: 4 },
      { id: "4-6", content: "            data[j] = data[j+1];", order: 5 },
      { id: "4-7", content: "            data[j+1] = temp;", order: 6 },
      { id: "4-8", content: "        }", order: 7 },
      { id: "4-9", content: "    }", order: 8 },
      { id: "4-10", content: "}", order: 9 }
    ],
    hint: "First declare array, then use nested loops for bubble sort with swapping"
  },
  {
    id: 5,
    name: "Reverse Array",
    description: "Arrange the code to reverse the elements of an array",
    snippets: [
      { id: "5-1", content: "int arr[] = {1, 2, 3, 4, 5};", order: 0 },
      { id: "5-2", content: "int start = 0, end = 4;", order: 1 },
      { id: "5-3", content: "while(start < end) {", order: 2 },
      { id: "5-4", content: "    int temp = arr[start];", order: 3 },
      { id: "5-5", content: "    arr[start] = arr[end];", order: 4 },
      { id: "5-6", content: "    arr[end] = temp;", order: 5 },
      { id: "5-7", content: "    start++;", order: 6 },
      { id: "5-8", content: "    end--;", order: 7 },
      { id: "5-9", content: "}", order: 8 }
    ],
    hint: "Initialize array, set start and end indices, then swap elements while moving towards center"
  }
];

interface CodeScrambleProps {
  onComplete: (score: number) => void;
}

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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className="flex-1 bg-black/30 p-4 rounded-lg font-mono text-white transition-all hover:bg-black/40 cursor-move"
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