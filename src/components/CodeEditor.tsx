import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  height?: string;
  onExecute?: (output: string) => void;
  expectedOutput?: string;
  onCorrect?: () => void;
  requiredStructures?: string[];
  onNextQuestion?: () => void;
  solution?: string;
}

interface JDoodleResponse {
  output: string;
  statusCode: number;
  memory: string;
  cpuTime: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
  height = '400px',
  onExecute,
  expectedOutput,
  onCorrect,
  requiredStructures = [],
  onNextQuestion,
  solution
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const MAX_ATTEMPTS = 3;
  const SOLUTION_DISPLAY_TIME = 3000; // 3 seconds to show solution
  const NAVIGATION_DELAY = 2000; // 2 seconds before navigation

  useEffect(() => {
    // Reset state when initialCode changes (new question)
    setCode(initialCode);
    setOutput('');
    setError('');
    setAttempts(0);
    setIsCorrect(false);
    setShowingSolution(false);
    setIsNavigating(false);
  }, [initialCode]);

  // Handle navigation after max attempts
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS && !isNavigating && !isCorrect) {
      setIsNavigating(true);
      setShowingSolution(true);
      setError('Maximum attempts reached. Moving to next question...');
      
      const timer = setTimeout(() => {
        if (onNextQuestion) {
          onNextQuestion();
        }
      }, SOLUTION_DISPLAY_TIME);
      
      return () => clearTimeout(timer);
    }
  }, [attempts, isNavigating, isCorrect, onNextQuestion]);

  const validateControlStructures = (code: string): boolean => {
    if (!requiredStructures || requiredStructures.length === 0) return true;

    const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    
    return requiredStructures.every(structure => {
      switch (structure) {
        case 'if':
          return /if\s*\([^)]*\)/.test(codeWithoutComments);
        case 'else':
          return /else\s*{/.test(codeWithoutComments);
        case 'for':
          return /for\s*\([^)]*\)/.test(codeWithoutComments);
        case 'while':
          return /while\s*\([^)]*\)/.test(codeWithoutComments);
        case 'do-while':
          return /do\s*{[^}]*}\s*while\s*\([^)]*\)/.test(codeWithoutComments);
        case 'switch':
          return /switch\s*\([^)]*\)/.test(codeWithoutComments);
        default:
          return true;
      }
    });
  };

  const normalizeOutput = (output: string): string => {
    return output
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  };

  const checkOutput = (actualOutput: string): boolean => {
    if (!expectedOutput) return true;
    
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    return normalizedActual === normalizedExpected;
  };

  const executeCode = async () => {
    if (showingSolution || isNavigating) return;
    
    setIsExecuting(true);
    setError('');
    setOutput('');

    if (!validateControlStructures(code)) {
      setError(`Your code must use the required control structures: ${requiredStructures.join(', ')}`);
      setIsExecuting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JDoodleResponse = await response.json();
      
      if (!data) {
        throw new Error('Invalid response from server');
      }

      let processedOutput = data.output || '';
      
      if (processedOutput === 'No output' && data.statusCode === 200) {
        processedOutput = '';
      }

      if (data.statusCode !== 200) {
        processedOutput = `Error: ${processedOutput}`;
      }

      if (processedOutput && !processedOutput.endsWith('\n')) {
        processedOutput += '\n';
      }

      setOutput(processedOutput || 'No output generated. Check your code for printf statements.');
      
      if (onExecute) {
        onExecute(processedOutput);
      }

      return processedOutput;

    } catch (err: any) {
      console.error('Code execution error:', err);
      setError(err.message || 'Failed to execute code');
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    if (attempts >= MAX_ATTEMPTS || showingSolution || isNavigating) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    const executionOutput = await executeCode();
    if (executionOutput === null) return; // Execution failed

    const outputMatches = checkOutput(executionOutput);
    
    if (outputMatches) {
      setIsCorrect(true);
      if (onCorrect) onCorrect();
      setIsNavigating(true);
      
      // Auto-navigate after showing success message
      setTimeout(() => {
        if (onNextQuestion) {
          onNextQuestion();
        }
      }, NAVIGATION_DELAY);
    } else {
      setError(`Incorrect output. ${MAX_ATTEMPTS - newAttempts} ${MAX_ATTEMPTS - newAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
    }
  };

  const handleSkip = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setShowingSolution(true);
    setError('Skipping to next question...');
    
    setTimeout(() => {
      if (onNextQuestion) {
        onNextQuestion();
      }
    }, NAVIGATION_DELAY);
  };

  return (
    <div className="space-y-4">
      <div 
        className="w-full bg-black/30 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <textarea
          value={showingSolution ? (solution || code) : code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-transparent text-white font-mono focus:outline-none resize-none"
          spellCheck="false"
          disabled={isExecuting || showingSolution || isNavigating}
        />
      </div>

      {expectedOutput && (
        <div className="bg-blue-500/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Expected Output:</h3>
          <pre className="text-blue-300 font-mono">{expectedOutput}</pre>
        </div>
      )}

      {requiredStructures && requiredStructures.length > 0 && (
        <div className="bg-purple-500/20 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Required Control Structures:</h3>
          <div className="flex flex-wrap gap-2">
            {requiredStructures.map((structure, index) => (
              <span key={index} className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-300">
                {structure}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={executeCode}
            disabled={isExecuting || showingSolution || isNavigating}
            className={`px-6 py-3 bg-white/20 rounded-lg text-white font-semibold transition-opacity flex items-center gap-2 ${
              (isExecuting || showingSolution || isNavigating) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Test Run
              </>
            )}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isExecuting || attempts >= MAX_ATTEMPTS || showingSolution || isNavigating}
            className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold transition-opacity flex items-center gap-2 ${
              (isExecuting || attempts >= MAX_ATTEMPTS || showingSolution || isNavigating) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Submit {attempts > 0 ? `(${attempts}/${MAX_ATTEMPTS})` : ''}
          </button>

         </div>

        {attempts > 0 && (
          <div className="text-white/70">
            Attempts: <span className="font-bold">{attempts}/{MAX_ATTEMPTS}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 text-red-400 rounded-lg">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isCorrect && (
        <div className="flex items-center gap-2 p-4 bg-green-500/20 text-green-400 rounded-lg">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p>Perfect! Your code produces the expected output. Moving to next question...</p>
        </div>
      )}

      {showingSolution && solution && (
        <div className="p-4 bg-blue-500/20 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Correct Solution:</h3>
          <pre className="text-blue-300 font-mono">{solution}</pre>
        </div>
      )}

      {output && !error && (
        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Output:</h3>
          <pre className="text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};