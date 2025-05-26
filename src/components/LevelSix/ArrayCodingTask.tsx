import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, HelpCircle } from 'lucide-react';

interface CodingTask {
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

const codingTasks: CodingTask[] = [
  {
    id: 1,
    title: "Array Sum Calculator",
    description: "Write a program that takes 5 numbers as input, stores them in an array, and prints their sum.",
    initialCode: `#include <stdio.h>

int main() {
    // Declare an array to store 5 numbers
    
    // Take 5 numbers as input and store them in the array
    
    // Calculate the sum of all elements
    
    // Print the sum
    
    return 0;
}`,
    expectedOutput: "Sum of array elements: 15",
    hint: "Use a loop to read inputs into the array, then another loop to calculate the sum",
    testCases: [
      {
        input: ["1", "2", "3", "4", "5"],
        output: ["Sum of array elements: 15"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "int",
        "array",
        "for",
        "scanf",
        "printf",
        "sum"
      ],
      forbiddenPatterns: []
    }
  },
  {
    id: 2,
    title: "Find Largest Number",
    description: "Write a program that takes 5 numbers as input, stores them in an array, and finds the largest number.",
    initialCode: `#include <stdio.h>

int main() {
    // Declare an array to store 5 numbers
    
    // Take 5 numbers as input and store them in the array
    
    // Find the largest number in the array
    
    // Print the largest number
    
    return 0;
}`,
    expectedOutput: "Largest number: 42",
    hint: "Initialize a variable to the first element, then compare with each element to find the maximum",
    testCases: [
      {
        input: ["12", "42", "8", "32", "15"],
        output: ["Largest number: 42"]
      }
    ],
    validationRules: {
      requiredPatterns: [
        "int",
        "array",
        "for",
        "scanf",
        "printf",
        "if"
      ],
      forbiddenPatterns: []
    }
  }
];

interface ArrayCodingTaskProps {
  onComplete: (score: number) => void;
}

export const ArrayCodingTask: React.FC<ArrayCodingTaskProps> = ({ onComplete }) => {
  const [selectedTask, setSelectedTask] = useState<CodingTask | null>(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    // Randomly select one of the two tasks
    const randomIndex = Math.floor(Math.random() * codingTasks.length);
    const task = codingTasks[randomIndex];
    setSelectedTask(task);
    setUserCode(task.initialCode);
  }, []);

  const validateCode = (code: string, rules: CodingTask['validationRules']): boolean => {
    // Check required patterns
    const hasAllRequired = rules.requiredPatterns.every(pattern => 
      code.toLowerCase().includes(pattern.toLowerCase())
    );

    // Check forbidden patterns
    const hasNoForbidden = rules.forbiddenPatterns.every(pattern => 
      !code.toLowerCase().includes(pattern.toLowerCase())
    );

    return hasAllRequired && hasNoForbidden;
  };

  const runCode = () => {
    if (!selectedTask) return;
    
    setIsCompiling(true);
    setOutput("Compiling and running code...\n");
    
    // Simulate compilation and execution delay
    setTimeout(() => {
      setIsCompiling(false);
      
      // Check if code contains required patterns
      const isValid = validateCode(userCode, selectedTask.validationRules);
      
      if (!isValid) {
        setOutput(prev => prev + "\nCompilation Error: Your code doesn't meet the requirements for this task.\n");
        return;
      }
      
      // Simulate execution based on the task
      let simulatedOutput = "";
      
      if (selectedTask.id === 1) { // Array Sum
        if (userCode.includes("int") && userCode.includes("array") && 
            userCode.includes("for") && userCode.includes("scanf") && 
            userCode.includes("sum") && userCode.includes("printf")) {
          simulatedOutput = "Sum of array elements: 15\n";
        } else {
          simulatedOutput = "Execution Error: Your code doesn't calculate the sum correctly.\n";
        }
      } else if (selectedTask.id === 2) { // Find Largest
        if (userCode.includes("int") && userCode.includes("array") && 
            userCode.includes("for") && userCode.includes("scanf") && 
            userCode.includes("if") && userCode.includes("printf")) {
          simulatedOutput = "Largest number: 42\n";
        } else {
          simulatedOutput = "Execution Error: Your code doesn't find the largest number correctly.\n";
        }
      }
      
      setOutput(prev => prev + "\nProgram Output:\n" + simulatedOutput);
    }, 1500);
  };

  const submitSolution = () => {
    if (!selectedTask) return;
    
    setAttempts(prev => prev + 1);
    
    // Check if code contains required patterns
    const isValid = validateCode(userCode, selectedTask.validationRules);
    
    if (isValid) {
      // Calculate score based on attempts (max 30 points)
      const points = Math.max(30 - attempts * 5, 10);
      
      setFeedback('✨ Great job! Your solution is correct!');
      
      // Simulate execution to show output
      runCode();
      
      // Complete the task after showing output
      setTimeout(() => {
        onComplete(points);
      }, 3000);
    } else {
      setFeedback('❌ Your solution doesn\'t meet the requirements. Try again!');
      setShowHint(true);
    }
  };

  if (!selectedTask) return <div className="text-white">Loading task...</div>;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{selectedTask.title}</h2>
        <p className="text-white/70">{selectedTask.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 bg-transparent text-white font-mono focus:outline-none resize-none"
              spellCheck="false"
              disabled={isCompiling}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={runCode}
              disabled={isCompiling}
              className={`px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${
                isCompiling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play className="w-5 h-5" />
              Run Code
            </button>
            <button
              onClick={submitSolution}
              disabled={isCompiling}
              className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${
                isCompiling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Submit Solution
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              disabled={isCompiling}
              className={`px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${
                isCompiling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4 h-64 overflow-auto">
            <h3 className="text-white font-semibold mb-2">Output:</h3>
            <pre className="text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
            {isCompiling && (
              <div className="animate-pulse text-blue-400 mt-2">
                Compiling and executing code...
              </div>
            )}
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg ${
              feedback.includes('✨') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {feedback}
            </div>
          )}

          {showHint && (
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <p className="text-blue-300">💡 Hint: {selectedTask.hint}</p>
            </div>
          )}

          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Expected Output:</h3>
            <pre className="text-blue-400 font-mono">{selectedTask.expectedOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};