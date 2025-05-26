import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface PointerQuizProps {
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
    question: "What does malloc() return on failure?",
    options: [
      "0",
      "NULL",
      "-1",
      "void pointer"
    ],
    correctAnswer: 1,
    explanation: "malloc() returns NULL when it fails to allocate memory.",
    hint: "Think about what indicates an invalid pointer"
  },
  {
    id: 2,
    question: "What happens when you free a pointer twice?",
    code: `int* ptr = malloc(sizeof(int));
free(ptr);
free(ptr); // What happens?`,
    options: [
      "Nothing",
      "Program crashes",
      "Memory leak",
      "Undefined behavior"
    ],
    correctAnswer: 3,
    explanation: "Double free leads to undefined behavior and can crash the program.",
    hint: "Consider what happens when deallocating already freed memory"
  },
  {
    id: 3,
    question: "Which function is used to resize dynamically allocated memory?",
    options: [
      "malloc()",
      "calloc()",
      "realloc()",
      "resize()"
    ],
    correctAnswer: 2,
    explanation: "realloc() is used to resize previously allocated memory blocks.",
    hint: "Look for a function that can change the size of existing allocation"
  },
  {
    id: 4,
    question: "What is a dangling pointer?",
    options: [
      "A pointer that points to NULL",
      "A pointer that hasn't been initialized",
      "A pointer that points to memory that has been freed",
      "A pointer to a local variable that has gone out of scope"
    ],
    correctAnswer: 2,
    explanation: "A dangling pointer points to memory that has been freed or deallocated.",
    hint: "Think about what happens to a pointer after you free its memory"
  },
  {
    id: 5,
    question: "What is the difference between malloc() and calloc()?",
    options: [
      "malloc() allocates memory for arrays, calloc() for single variables",
      "malloc() returns void pointer, calloc() returns typed pointer",
      "calloc() initializes memory to zero, malloc() leaves it uninitialized",
      "There is no difference"
    ],
    correctAnswer: 2,
    explanation: "calloc() initializes all allocated memory to zero, while malloc() leaves the memory uninitialized.",
    hint: "Think about the initial state of the allocated memory"
  },
  {
    id: 6,
    question: "What does the following code do?",
    code: `int x = 10;
int *p = &x;
*p = 20;`,
    options: [
      "Creates a pointer p with value 10",
      "Sets x to 20",
      "Sets p to 20",
      "Creates a memory leak"
    ],
    correctAnswer: 1,
    explanation: "The code creates a pointer p that points to x, then changes the value at that address to 20, effectively changing x to 20.",
    hint: "Follow the operations step by step: declaration, address assignment, dereferencing"
  },
  {
    id: 7,
    question: "What is the purpose of the & operator in C?",
    options: [
      "Bitwise AND operation",
      "Logical AND operation",
      "Get the address of a variable",
      "Dereference a pointer"
    ],
    correctAnswer: 2,
    explanation: "The & operator is used to get the memory address of a variable.",
    hint: "Think about how you initialize a pointer with a variable's location"
  },
  {
    id: 8,
    question: "What is the purpose of the * operator when used with pointers?",
    options: [
      "Multiplication",
      "Declaration of a pointer",
      "Dereferencing a pointer",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "The * operator is used both to declare a pointer and to dereference it (access the value it points to).",
    hint: "Consider the different contexts where * appears with pointers"
  },
  {
    id: 9,
    question: "What will happen in this code?",
    code: `char *str = "Hello";
str[0] = 'J';`,
    options: [
      "str becomes \"Jello\"",
      "Compilation error",
      "Runtime error or undefined behavior",
      "Nothing happens"
    ],
    correctAnswer: 2,
    explanation: "String literals in C are stored in read-only memory. Attempting to modify them causes undefined behavior or a runtime error.",
    hint: "Consider the memory location of string literals"
  },
  {
    id: 10,
    question: "What is a memory leak?",
    options: [
      "When a program uses too much memory",
      "When memory is allocated but never freed",
      "When a pointer points to invalid memory",
      "When memory is freed twice"
    ],
    correctAnswer: 1,
    explanation: "A memory leak occurs when dynamically allocated memory is not freed, causing the program to consume more and more memory over time.",
    hint: "Think about the lifecycle of dynamically allocated memory"
  },
  {
    id: 11,
    question: "What does the following code print?",
    code: `int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;
printf("%d", *(p+2));`,
    options: [
      "10",
      "20",
      "30",
      "Address of arr[2]"
    ],
    correctAnswer: 2,
    explanation: "p points to the first element of arr. p+2 points to the third element (arr[2]), which is 30. *(p+2) dereferences this to get the value 30.",
    hint: "Remember that array names decay to pointers, and pointer arithmetic works in terms of the size of the pointed-to type"
  },
  {
    id: 12,
    question: "What is the correct way to allocate memory for an array of 10 integers?",
    options: [
      "int *arr = malloc(10);",
      "int *arr = malloc(10 * sizeof(int));",
      "int *arr = new int[10];",
      "int *arr = calloc(10);"
    ],
    correctAnswer: 1,
    explanation: "malloc() takes the total number of bytes to allocate. For an array of 10 integers, you need 10 * sizeof(int) bytes.",
    hint: "Remember to account for the size of each element"
  },
  {
    id: 13,
    question: "What is a void pointer?",
    options: [
      "A pointer that points to nothing",
      "A pointer that can point to any data type",
      "A pointer to a void function",
      "A NULL pointer"
    ],
    correctAnswer: 1,
    explanation: "A void pointer (void*) is a generic pointer that can point to any data type. It needs to be cast to a specific type before dereferencing.",
    hint: "Think about the versatility of certain pointer types"
  },
  {
    id: 14,
    question: "What is the difference between passing by value and passing by reference?",
    options: [
      "Passing by value is faster",
      "Passing by reference allows the function to modify the original variable",
      "Passing by value uses less memory",
      "There is no difference in C"
    ],
    correctAnswer: 1,
    explanation: "When passing by value, a copy of the variable is passed. When passing by reference (using pointers in C), the function can modify the original variable.",
    hint: "Consider what happens to the original variable when modified inside a function"
  },
  {
    id: 15,
    question: "What does the following code do?",
    code: `int **matrix = (int**)malloc(3 * sizeof(int*));
for(int i = 0; i < 3; i++) {
    matrix[i] = (int*)malloc(4 * sizeof(int));
}`,
    options: [
      "Creates a 3x4 2D array",
      "Creates a 4x3 2D array",
      "Creates a 3D array",
      "Causes a memory leak"
    ],
    correctAnswer: 0,
    explanation: "The code allocates memory for a 3x4 2D array: 3 rows, each containing 4 integers.",
    hint: "Analyze the nested allocation pattern"
  },
  {
    id: 16,
    question: "What is the purpose of the NULL macro?",
    options: [
      "To initialize variables to zero",
      "To represent an invalid or non-existent pointer",
      "To terminate strings",
      "To free memory"
    ],
    correctAnswer: 1,
    explanation: "NULL is used to represent an invalid or non-existent pointer. It's often used to initialize pointers or check if a pointer is valid.",
    hint: "Think about how you would represent a pointer that doesn't point anywhere valid"
  },
  {
    id: 17,
    question: "What happens if you dereference a NULL pointer?",
    options: [
      "Nothing",
      "You get a value of 0",
      "Compilation error",
      "Runtime error or undefined behavior"
    ],
    correctAnswer: 3,
    explanation: "Dereferencing a NULL pointer causes a runtime error (often a segmentation fault) or undefined behavior.",
    hint: "Consider what memory address NULL represents"
  },
  {
    id: 18,
    question: "What is pointer arithmetic?",
    options: [
      "Mathematical operations on memory addresses",
      "Adding or subtracting integers to/from pointers",
      "Converting between pointer types",
      "Comparing pointers"
    ],
    correctAnswer: 1,
    explanation: "Pointer arithmetic involves adding or subtracting integers to/from pointers, which adjusts the address based on the size of the pointed-to type.",
    hint: "Think about how you would navigate through an array using a pointer"
  },
  {
    id: 19,
    question: "What is the correct way to free a dynamically allocated 2D array?",
    code: `int **matrix = (int**)malloc(3 * sizeof(int*));
for(int i = 0; i < 3; i++) {
    matrix[i] = (int*)malloc(4 * sizeof(int));
}
// Free code here`,
    options: [
      "free(matrix);",
      "for(int i = 0; i < 3; i++) free(matrix[i]); free(matrix);",
      "free(matrix[0]); free(matrix);",
      "free(**matrix);"
    ],
    correctAnswer: 1,
    explanation: "You need to free each row first, then free the array of pointers. This prevents memory leaks.",
    hint: "Remember that each allocation needs a corresponding free"
  },
  {
    id: 20,
    question: "What is the difference between a null pointer and a void pointer?",
    options: [
      "They are the same thing",
      "A null pointer doesn't point anywhere, a void pointer can point to any type",
      "A null pointer is used for strings, a void pointer for other types",
      "A void pointer is always NULL"
    ],
    correctAnswer: 1,
    explanation: "A null pointer (NULL) doesn't point to any valid memory location. A void pointer (void*) can point to any data type but must be cast before dereferencing.",
    hint: "Consider the purpose and usage of each pointer type"
  }
];

export const PointerQuiz: React.FC<PointerQuizProps> = ({ onComplete }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    // Randomly select 8 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 8));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === selectedQuestions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      setCorrectAnswers(prev => prev + 1);
      setFeedback('✨ Correct! Well done!');
    } else {
      setFeedback('❌ Wrong answer. The correct answer is highlighted.');
    }
    
    setShowFeedback(true);

    // Move to next question after showing feedback
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback('');
      
      if (currentQuestionIndex === selectedQuestions.length - 1) {
        setFeedback('🎉 Quiz completed! Moving to next challenge...');
        setTimeout(() => onComplete(score + (isCorrect ? 20 : 0)), 2000);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1500);
  };

  if (selectedQuestions.length === 0) return null;

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Memory Management Quiz</h2>
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