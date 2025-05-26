import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface ArrayQuizProps {
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "How do you declare an integer array of size 5 in C?",
    options: [
      "array[5] int;",
      "int array[5];",
      "int[5] array;",
      "int array{5};"
    ],
    correctAnswer: 1,
    explanation: "In C, array declaration follows the syntax: type arrayName[size];",
    hint: "Array size goes after the array name in square brackets"
  },
  {
    id: 2,
    question: "What is the output of this code?",
    code: `int arr[] = {1, 2, 3, 4, 5};
printf("%d", arr[3]);`,
    options: [
      "3",
      "4",
      "5",
      "2"
    ],
    correctAnswer: 1,
    explanation: "Array indexing starts at 0, so arr[3] accesses the fourth element (4)",
    hint: "Count the elements starting from 0"
  },
  {
    id: 3,
    question: "Which of these is a valid array initialization?",
    options: [
      "int arr[3] = {1, 2, 3, 4};",
      "int arr[] = {1, 2, 3};",
      "int arr[3] = 1, 2, 3;",
      "int arr(3) = {1, 2, 3};"
    ],
    correctAnswer: 1,
    explanation: "Array initialization uses curly braces and can omit size if initialized immediately",
    hint: "Look for proper use of curly braces and array size"
  },
  {
    id: 4,
    question: "What happens if you access an array index out of bounds?",
    options: [
      "The program returns 0",
      "The array automatically expands",
      "Undefined behavior",
      "The program continues normally"
    ],
    correctAnswer: 2,
    explanation: "Accessing array elements outside its bounds leads to undefined behavior",
    hint: "Think about memory safety in C"
  },
  {
    id: 5,
    question: "How do you declare a 2D array with 3 rows and 4 columns?",
    options: [
      "int arr[4, 3];",
      "int arr[3][4];",
      "int arr(3, 4);",
      "int arr[4][3];"
    ],
    correctAnswer: 1,
    explanation: "2D arrays use two sets of square brackets: first for rows, then columns",
    hint: "Think about rows first, then columns"
  },
  {
    id: 6,
    question: "What is the correct way to pass an array to a function?",
    code: `void processArray(_____ arr, int size) {
    // Function body
}`,
    options: [
      "int arr[]",
      "int* arr",
      "Both A and B",
      "Neither A nor B"
    ],
    correctAnswer: 2,
    explanation: "In C, arrays can be passed to functions either as int arr[] or int* arr, both are equivalent",
    hint: "Arrays decay to pointers when passed to functions"
  },
  {
    id: 7,
    question: "How do you find the length of an array in C?",
    options: [
      "Using the length() function",
      "Using the sizeof operator",
      "Using the size property",
      "C doesn't provide a direct way to find array length"
    ],
    correctAnswer: 3,
    explanation: "C doesn't provide a built-in way to find array length. You need to either keep track of it separately or use sizeof(arr)/sizeof(arr[0]) which only works in certain contexts",
    hint: "Think about C's low-level nature"
  },
  {
    id: 8,
    question: "What is the memory layout of a 2D array in C?",
    options: [
      "Elements are stored in random memory locations",
      "Elements are stored in a linked list structure",
      "Elements are stored in row-major order",
      "Elements are stored in column-major order"
    ],
    correctAnswer: 2,
    explanation: "In C, 2D arrays are stored in row-major order, meaning all elements of the first row are stored contiguously, followed by all elements of the second row, and so on",
    hint: "Think about how memory is organized in C"
  },
  {
    id: 9,
    question: "What is the output of this code?",
    code: `int arr[2][3] = {{1, 2, 3}, {4, 5, 6}};
printf("%d", arr[1][0]);`,
    options: [
      "1",
      "3",
      "4",
      "6"
    ],
    correctAnswer: 2,
    explanation: "arr[1][0] accesses the first element of the second row, which is 4",
    hint: "First index is row, second is column"
  },
  {
    id: 10,
    question: "Which of the following is true about arrays in C?",
    options: [
      "Arrays can be resized dynamically",
      "Array names are constant pointers",
      "Arrays can store different data types",
      "Array indices can be negative"
    ],
    correctAnswer: 1,
    explanation: "In C, array names are constant pointers to the first element of the array",
    hint: "Think about the relationship between arrays and pointers"
  }
];

export const ArrayQuiz: React.FC<ArrayQuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [feedbackTimer, setFeedbackTimer] = useState(2000); // Default 2 seconds

  useEffect(() => {
    // Randomly select 5 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === selectedQuestions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      setFeedback('✨ Correct! Well done!');
      // Shorter feedback time for correct answers
      setFeedbackTimer(1500);
    } else {
      setFeedback('❌ Wrong answer! Moving to next question...');
      // Even shorter feedback time for wrong answers
      setFeedbackTimer(1000);
    }
    
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback('');
      
      // For both correct and incorrect answers, move to the next question
      if (currentQuestionIndex === selectedQuestions.length - 1) {
        // Show completion message for 2 seconds before moving on
        setFeedback('🎉 Quiz completed! Starting Array Adventure...');
        setTimeout(() => onComplete(score + (isCorrect ? 20 : 0)), 2000);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, feedbackTimer);
  };

  if (selectedQuestions.length === 0) {
    return <div className="text-white">Loading questions...</div>;
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Array Quiz</h2>
        <p className="text-white/70">Question {currentQuestionIndex + 1} of {selectedQuestions.length}</p>
      </div>

      <div className="space-y-6">
        <div className="text-lg text-white">{currentQuestion.question}</div>

        {currentQuestion.code && (
          <div className="bg-black/30 p-4 rounded-lg">
            <pre className="text-green-400 font-mono">{currentQuestion.code}</pre>
          </div>
        )}

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`p-4 rounded-lg text-left transition-all ${
                showFeedback && index === currentQuestion.correctAnswer
                  ? 'bg-green-500/20 text-green-400'
                  : showFeedback && index === selectedAnswer
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-6 py-3 bg-white/20 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <HelpCircle className="w-5 h-5" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>

          <div className="text-white">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>

        {showHint && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">💡 Hint: {currentQuestion.hint}</p>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-lg text-lg ${
            feedback.includes('✨') || feedback.includes('🎉')
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {showFeedback && (
          <div className="p-4 bg-purple-500/20 rounded-lg">
            <p className="text-purple-400">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};