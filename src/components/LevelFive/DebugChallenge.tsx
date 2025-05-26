import React, { useState, useEffect } from 'react';
import { Code, CheckCircle, HelpCircle } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  code: string;
  bugs: {
    line: number;
    type: 'syntax' | 'logical';
    description: string;
    hint: string;
    correctCode: string;
  }[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "For Loop Structure",
    description: "Fix the syntax errors in this for loop",
    code: `int main() {
    for(int i = 0, i < 5, i++) {
        printf("%d", i)
    }
    return 0;
}`,
    bugs: [
      {
        line: 2,
        type: 'syntax',
        description: "Incorrect for loop syntax",
        hint: "For loop parts should be separated by semicolons",
        correctCode: "for(int i = 0; i < 5; i++) {"
      },
      {
        line: 3,
        type: 'syntax',
        description: "Missing semicolon",
        hint: "Statements need semicolons",
        correctCode: 'printf("%d", i);'
      }
    ]
  },
  {
    id: 2,
    title: "If-Else Statement",
    description: "Fix the if-else statement errors",
    code: `int main() {
    int x = 10;
    if(x > 5);
    {
        printf("Greater than 5");
    }
    else {
        printf("Less than or equal to 5");
    }
    return 0;
}`,
    bugs: [
      {
        line: 3,
        type: 'logical',
        description: "Semicolon after if condition",
        hint: "Don't put semicolon after if condition",
        correctCode: "if(x > 5)"
      }
    ]
  },
  {
    id: 3,
    title: "While Loop",
    description: "Fix the while loop syntax",
    code: `int main() {
    int count == 0;
    while(count < 5) 
        printf("%d", count);
        count++;}
    return 0;
}`,
    bugs: [
      {
        line: 2,
        type: 'logical',
        description: "Comparison instead of assignment",
        hint: "Use = for assignment, == for comparison",
        correctCode: "int count = 0;"
      },
      {
        line: 3,
        type: 'logical',
        description: "Missing braces for multiple statements",
        hint: "Use braces to group multiple statements",
        correctCode: '    while(count < 5) {'
      }
    ]
  },
  {
    id: 4,
    title: "Switch Statement",
    description: "Fix the switch statement errors",
    code: `int main() {
    int choice = 1;
    switch(choice) {
        case 1:
            printf("One")
        case 2:
            printf("Two");
            break;
        default;
            printf("Other");
    }
    return 0;
}`,
    bugs: [
      {
        line: 5,
        type: 'syntax',
        description: "Missing semicolon and break",
        hint: "Add semicolon and break statement",
        correctCode: '            printf("One");'
      },
      {
        line: 9,
        type: 'syntax',
        description: "Incorrect default syntax",
        hint: "default should have a colon, not semicolon",
        correctCode: "        default:"
      }
    ]
  }
];

interface DebugChallengeProps {
  locationIndex: number;
  onComplete: (score: number) => void;
}

export const DebugChallenge: React.FC<DebugChallengeProps> = ({
  locationIndex,
  onComplete
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [userCorrections, setUserCorrections] = useState<{ [key: number]: string }>({});
  const [foundBugs, setFoundBugs] = useState<number[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const shuffledChallenges = [...challenges].sort(() => Math.random() - 0.5);
    
    const firstChallenge = shuffledChallenges[0];
    setCurrentChallenge(firstChallenge);
    setUserCode(firstChallenge.code);
    setAskedQuestions([firstChallenge.id]);
    setQuestionIndex(0);
    
    setFeedback('');
    setUserCorrections({});
    setShowHint(false);
    setSelectedLine(null);
    setFoundBugs([]);
  }, []);

  const moveToNextQuestion = () => {
    const availableChallenges = challenges.filter(c => !askedQuestions.includes(c.id));
    
    if (availableChallenges.length > 0) {
      const nextChallenge = availableChallenges[0];
      setCurrentChallenge(nextChallenge);
      setUserCode(nextChallenge.code);
      setAskedQuestions(prev => [...prev, nextChallenge.id]);
      setQuestionIndex(prev => prev + 1);
      
      setFeedback('');
      setUserCorrections({});
      setShowHint(false);
      setSelectedLine(null);
      setFoundBugs([]);
    } else {
      onComplete(30);
    }
  };

  const handleLineClick = (lineNumber: number) => {
    if (!currentChallenge) return;
    
    const bug = currentChallenge.bugs.find(b => b.line === lineNumber);
    if (bug && !foundBugs.includes(lineNumber)) {
      setSelectedLine(lineNumber);
      setShowHint(true);
    } else if (!bug) {
      setFeedback('❌ No bug on this line');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  const handleCodeSubmit = (lineNumber: number, correction: string) => {
    if (!currentChallenge || !selectedLine) return;

    const bug = currentChallenge.bugs.find(b => b.line === lineNumber);
    if (!bug) return;

    const normalizedCorrection = correction.trim().replace(/\s+/g, ' ');
    const normalizedExpected = bug.correctCode.trim().replace(/\s+/g, ' ');

    if (normalizedCorrection === normalizedExpected) {
      const newFoundBugs = [...foundBugs, lineNumber];
      setFoundBugs(newFoundBugs);
      setUserCorrections(prev => ({ ...prev, [lineNumber]: correction }));
      setFeedback(`✨ Found and fixed a ${bug.type} error!`);
      setSelectedLine(null);

      if (newFoundBugs.length === currentChallenge.bugs.length) {
        setFeedback('🎉 All bugs fixed! Moving to next challenge...');
        setTimeout(() => {
          if (questionIndex >= 2) {
            onComplete(30);
          } else {
            moveToNextQuestion();
          }
        }, 1500);
      }
    } else {
      setFeedback('❌ That correction is not quite right. Try again!');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (!currentChallenge) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h2>
        <p className="text-white/70">{currentChallenge.description}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-black/30 rounded-lg p-6 font-mono">
          {currentChallenge.code.split('\n').map((line, index) => (
            <div
              key={index}
              onClick={() => handleLineClick(index + 1)}
              className={`flex items-center gap-4 py-1 cursor-pointer ${
                foundBugs.includes(index + 1)
                  ? 'bg-green-500/20 text-green-400'
                  : selectedLine === index + 1
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'hover:bg-white/5 text-white'
              }`}
            >
              <span className="w-8 text-white/50">{index + 1}</span>
              <span>
                {foundBugs.includes(index + 1) 
                  ? userCorrections[index + 1] 
                  : line}
              </span>
              {foundBugs.includes(index + 1) && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
          ))}
        </div>

        {selectedLine && (
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Fix the bug:</h3>
            <input
              type="text"
              className="w-full bg-black/30 text-white font-mono p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter the corrected code"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCodeSubmit(selectedLine, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        )}

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
              Question: <span className="font-bold">{questionIndex + 1}/3</span>
            </div>
            <div className="text-white">
              Bugs Found: <span className="font-bold">{foundBugs.length}/{currentChallenge.bugs.length}</span>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg ${
            feedback.includes('✨') || feedback.includes('🎉') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}

        {showHint && selectedLine && (
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-300">
              💡 Hint: {currentChallenge.bugs.find(b => b.line === selectedLine)?.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};