import React, { useState, useEffect } from 'react';
import { Play, AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  height?: string;
  onExecute?: (output: string) => void;
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
  onExecute 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [code]);

  const executeCode = async () => {
    setIsExecuting(true);
    setError('');
    setOutput('');

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

      const output = data.output || 'No output';
      setOutput(output);
      
      if (onExecute) {
        onExecute(output);
      }

    } catch (err: any) {
      console.error('Code execution error:', err);
      setError(err.message || 'Failed to execute code');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="w-full bg-black/30 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-transparent text-white font-mono focus:outline-none resize-none"
          spellCheck="false"
          disabled={isExecuting}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold transition-opacity flex items-center gap-2 ${
            isExecuting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
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
              Run Code
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 text-red-400 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
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