import React, { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

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
    question: "What will be the output of this for loop?",
    code: `for(int i = 0; i < 5; i++) {
    printf("%d ", i);
}`,
    options: [
      "0 1 2 3 4",
      "1 2 3 4 5",
      "0 1 2 3 4 5",
      "1 2 3 4"
    ],
    correctAnswer: 0,
    explanation: "The loop starts at 0 and runs while i is less than 5, printing 0 through 4.",
    hint: "Check the loop's starting value and condition"
  },
  {
    id: 2,
    question: "Which loop is guaranteed to execute at least once?",
    options: [
      "for loop",
      "while loop",
      "do-while loop",
      "None of the above"
    ],
    correctAnswer: 2,
    explanation: "do-while loop checks its condition after executing the loop body, ensuring at least one execution.",
    hint: "Think about when the condition is checked in each loop type"
  },
  {
    id: 3,
    question: "What is the purpose of the break statement?",
    options: [
      "Skip the current iteration",
      "Exit the loop immediately",
      "Skip to the next loop",
      "Pause the loop execution"
    ],
    correctAnswer: 1,
    explanation: "break statement immediately terminates the loop it's in.",
    hint: "Think about what happens when you 'break' something"
  },
  {
    id: 4,
    question: "What will this code print?",
    code: `int x = 5;
switch(x) {
    case 1: printf("One");
    case 5: printf("Five");
    case 6: printf("Six");
    default: printf("Default");
}`,
    options: [
      "Five",
      "FiveSixDefault",
      "Default",
      "One"
    ],
    correctAnswer: 1,
    explanation: "Without break statements, switch falls through all cases after a match.",
    hint: "Look for break statements in the switch"
  },
  {
    id: 5,
    question: "What does the continue statement do?",
    options: [
      "Exits the loop",
      "Skips to the next iteration",
      "Pauses the loop",
      "Restarts the program"
    ],
    correctAnswer: 1,
    explanation: "continue skips the rest of the current iteration and moves to the next one.",
    hint: "Think about continuing with the next step"
  },
  {
    id: 6,
    question: "How do you declare an infinite loop?",
    options: [
      "while(1)",
      "for(;;)",
      "Both A and B",
      "Neither A nor B"
    ],
    correctAnswer: 2,
    explanation: "Both while(1) and for(;;) create infinite loops in C.",
    hint: "Consider different ways to create loops that never end"
  },
  {
    id: 7,
    question: "What is the output of this nested loop?",
    code: `for(int i = 0; i < 2; i++) {
    for(int j = 0; j < 2; j++) {
        printf("%d%d ", i, j);
    }
}`,
    options: [
      "00 01 10 11",
      "11 12 21 22",
      "00 11",
      "01 10"
    ],
    correctAnswer: 0,
    explanation: "The nested loops print combinations of i and j values.",
    hint: "Track each variable's value in each iteration"
  },
  {
    id: 8,
    question: "What is the difference between while and do-while loop?",
    options: [
      "No difference",
      "while checks condition at start, do-while at end",
      "do-while is faster",
      "while uses less memory"
    ],
    correctAnswer: 1,
    explanation: "while checks condition before executing loop body, do-while checks after.",
    hint: "Think about when the condition is evaluated"
  },
  {
    id: 9,
    question: "What happens if break is used inside nested loops?",
    options: [
      "Exits all loops",
      "Exits only the innermost loop",
      "Exits the program",
      "Causes error"
    ],
    correctAnswer: 1,
    explanation: "break only exits the loop it's directly contained in.",
    hint: "Consider scope of break statement"
  },
  {
    id: 10,
    question: "Which statement is used to skip loop iterations?",
    options: [
      "break",
      "continue",
      "skip",
      "return"
    ],
    correctAnswer: 1,
    explanation: "continue skips the rest of current iteration and moves to next.",
    hint: "Look for keyword that continues to next iteration"
  },
  {
    id: 11,
    question: "What is the purpose of default in switch?",
    options: [
      "Must be first case",
      "Executes if no case matches",
      "Optional statement",
      "Executes every time"
    ],
    correctAnswer: 1,
    explanation: "default case executes when no other case matches the switch expression.",
    hint: "Think about fallback behavior"
  },
  {
    id: 12,
    question: "What happens if break is omitted in switch case?",
    options: [
      "Error occurs",
      "Next case is skipped",
      "Falls through to next case",
      "Program crashes"
    ],
    correctAnswer: 2,
    explanation: "Without break, execution falls through to next case.",
    hint: "Consider case separation"
  },
  {
    id: 13,
    question: "Which loop is best for known number of iterations?",
    options: [
      "while",
      "do-while",
      "for",
      "switch"
    ],
    correctAnswer: 2,
    explanation: "for loop is designed for known number of iterations.",
    hint: "Think about loop initialization and counting"
  },
  {
    id: 14,
    question: "What is the output of this code?",
    code: `int i = 0;
while(i < 3) {
    printf("%d", i++);
}`,
    options: [
      "123",
      "012",
      "001",
      "000"
    ],
    correctAnswer: 1,
    explanation: "Prints i then increments, starting from 0 until < 3.",
    hint: "Note postfix increment operator"
  },
  {
    id: 15,
    question: "How many times will this loop execute?",
    code: `int x = 1;
do {
    x *= 2;
} while(x < 10);`,
    options: [
      "3 times",
      "4 times",
      "5 times",
      "6 times"
    ],
    correctAnswer: 0,
    explanation: "x becomes 2, 4, 8, then 16 (loop stops), so 3 iterations.",
    hint: "Track value changes"
  },
  {
    id: 16,
    question: "What is the purpose of else if?",
    options: [
      "Same as else",
      "Checks additional conditions",
      "Always required",
      "Faster than if"
    ],
    correctAnswer: 1,
    explanation: "else if allows checking multiple conditions in sequence.",
    hint: "Think about multiple condition checking"
  },
  {
    id: 17,
    question: "Can switch use string values?",
    options: [
      "Yes, always",
      "No, never",
      "Only in C++",
      "Depends on compiler"
    ],
    correctAnswer: 1,
    explanation: "C switch only works with integral types (int, char, etc).",
    hint: "Consider C language limitations"
  },
  {
    id: 18,
    question: "What is a nested if statement?",
    options: [
      "Multiple else statements",
      "if inside another if",
      "if without else",
      "Multiple conditions in if"
    ],
    correctAnswer: 1,
    explanation: "Nested if is an if statement inside another if statement.",
    hint: "Think about statement hierarchy"
  },
  {
    id: 19,
    question: "What is the maximum number of else if statements?",
    options: [
      "1",
      "10",
      "255",
      "No limit"
    ],
    correctAnswer: 3,
    explanation: "There is no limit to number of else if statements.",
    hint: "Consider language restrictions"
  },
  {
    id: 20,
    question: "Which is more efficient?",
    options: [
      "Multiple if statements",
      "if-else chain",
      "switch statement",
      "Depends on case"
    ],
    correctAnswer: 2,
    explanation: "switch is generally more efficient for multiple conditions.",
    hint: "Think about compiler optimization"
  }
];

interface ControlStructuresQuizProps {
  onComplete: (score: number, correctCount: number) => void;
}

const ControlStructuresQuiz: React.FC<ControlStructuresQuizProps> = ({ onComplete }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [askedQuestionIds, setAskedQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    // Get available questions (excluding previously asked ones)
    const availableQuestions = questions.filter(q => !askedQuestionIds.includes(q.id));
    
    // Randomly select 5 questions
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    // Update selected questions and asked questions list
    setSelectedQuestions(selected);
    setAskedQuestionIds(prev => [...prev, ...selected.map(q => q.id)]);
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

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setFeedback('');
      
      if (currentQuestionIndex === selectedQuestions.length - 1) {
        setFeedback('🎉 Quiz completed! Moving to next challenge...');
        setTimeout(() => onComplete(score + (isCorrect ? 20 : 0), correctAnswers + (isCorrect ? 1 : 0)), 2000);
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
        <h2 className="text-2xl font-bold text-white mb-2">Control Structures Quiz</h2>
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

export default ControlStructuresQuiz;