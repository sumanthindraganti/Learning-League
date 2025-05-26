import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface FunctionQuizProps {
  onComplete: (points: number, correctCount: number, challengeData: ChallengeAttempt) => void;
}

interface ChallengeAttempt {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  attempts: number;
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
    question: "What is the purpose of a function in C programming?",
    options: [
      "To make the code longer",
      "To organize code into reusable blocks",
      "To slow down program execution",
      "To increase memory usage"
    ],
    correctAnswer: 1,
    explanation: "Functions help organize code into reusable blocks, making programs more modular and easier to maintain.",
    hint: "Think about code organization and reusability"
  },
  {
    id: 2,
    question: "What is the correct way to pass an array to a function?",
    code: `void processArray(______ arr, int size) {
    // Function body
}`,
    options: [
      "int arr[]",
      "array int",
      "int [arr]",
      "arr int[]"
    ],
    correctAnswer: 0,
    explanation: "In C, arrays are passed using the syntax 'type arr[]' or 'type* arr'.",
    hint: "Arrays decay to pointers when passed to functions"
  },
  {
    id: 3,
    question: "What is the return type of a function that does not return any value?",
    options: [
      "int",
      "void",
      "null",
      "empty"
    ],
    correctAnswer: 1,
    explanation: "The 'void' keyword is used when a function doesn't return any value.",
    hint: "Think about what represents 'no return value' in C"
  },
  {
    id: 4,
    question: "How does recursion work in C?",
    code: `int factorial(int n) {
    if(n == 0) return 1;
    return n * factorial(n-1);
}`,
    options: [
      "Function calls itself with modified arguments",
      "Function creates a loop internally",
      "Function uses multiple return statements",
      "Function allocates extra memory"
    ],
    correctAnswer: 0,
    explanation: "Recursion occurs when a function calls itself with different arguments until a base case is reached.",
    hint: "Look at how the function calls itself in the example"
  },
  {
    id: 5,
    question: "What is the difference between global and local variables in functions?",
    options: [
      "Global variables use more memory",
      "Local variables are faster",
      "Global variables are accessible everywhere, local only within their scope",
      "Local variables are always initialized"
    ],
    correctAnswer: 2,
    explanation: "Global variables can be accessed from any function, while local variables are only accessible within their declaring function.",
    hint: "Think about variable scope and accessibility"
  },
  {
    id: 6,
    question: "What is function overloading, and does C support it?",
    options: [
      "C supports function overloading natively",
      "C doesn't support function overloading",
      "Only newer versions of C support it",
      "It depends on the compiler"
    ],
    correctAnswer: 1,
    explanation: "C does not support function overloading. Each function must have a unique name.",
    hint: "Consider C's approach to function names"
  },
  {
    id: 7,
    question: "What is a function prototype in C?",
    code: `int calculateSum(int a, int b);  // What is this?`,
    options: [
      "A function definition",
      "A function declaration",
      "A function call",
      "A function variable"
    ],
    correctAnswer: 1,
    explanation: "A function prototype is a declaration that specifies the function's name, return type, and parameters without the implementation.",
    hint: "Look at what's missing compared to a full function definition"
  },
  {
    id: 8,
    question: "What happens if a function is called without a proper declaration?",
    options: [
      "Nothing, C handles it automatically",
      "The program crashes at runtime",
      "The compiler assumes default return type and parameters",
      "The compiler generates an error or warning"
    ],
    correctAnswer: 3,
    explanation: "The C compiler requires functions to be declared before use, otherwise it generates an error or warning.",
    hint: "Think about C's compilation process"
  },
  {
    id: 9,
    question: "How does Call by Reference differ from Call by Value?",
    code: `void swap(int* a, int* b) {  // What method is this?`,
    options: [
      "Call by Reference modifies copies of variables",
      "Call by Value modifies original variables",
      "Call by Reference modifies original variables through pointers",
      "They are the same thing"
    ],
    correctAnswer: 2,
    explanation: "Call by Reference uses pointers to modify the original variables, while Call by Value works with copies.",
    hint: "Notice the use of pointers in the example"
  },
  {
    id: 10,
    question: "What is the purpose of the return statement in a function?",
    options: [
      "To end the program",
      "To send a value back to the calling function",
      "To create a loop",
      "To declare variables"
    ],
    correctAnswer: 1,
    explanation: "The return statement sends a value back to the function that called it, allowing functions to produce results.",
    hint: "Think about how functions communicate their results"
  }
];

export const FunctionQuiz: React.FC<FunctionQuizProps> = ({ onComplete }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    // Randomly select 5 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      setCorrectAnswers(prev => prev + 1);
      setFeedback('✨ Correct! Well done!');
    } else {
      setFeedback('❌ Wrong answer. The correct answer is highlighted.');
    }
    
    setShowFeedback(true);

    // Create challenge attempt data
    const challengeData: ChallengeAttempt = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
      userAnswer: currentQuestion.options[answerIndex],
      isCorrect: isCorrect,
      attempts: 1
    };

    // For both correct and incorrect answers, move to the next question after showing feedback
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback('');
      
      if (currentQuestionIndex === selectedQuestions.length - 1) {
        setFeedback('🎉 Quiz completed! Moving to next challenge...');
        setTimeout(() => onComplete(score + (isCorrect ? 20 : 0), correctAnswers + (isCorrect ? 1 : 0), challengeData), 2000);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 3000);
  };

  if (selectedQuestions.length === 0) return null;

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Function Concepts Quiz</h2>
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
                  ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                  : showFeedback && index === selectedAnswer
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {option}
              {showFeedback && index === currentQuestion.correctAnswer && (
                <span className="ml-2 inline-flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  Correct Answer
                </span>
              )}
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

          <div className="flex items-center gap-4">
            <div className="text-white">
              Correct: <span className="font-bold">{correctAnswers}/{currentQuestionIndex + 1}</span>
            </div>
            <div className="text-white">
              Score: <span className="font-bold">{score}</span>
            </div>
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