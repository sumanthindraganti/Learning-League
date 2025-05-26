import React from 'react';
import { Rocket, Brain } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Rocket className="w-8 h-8 text-purple-500" />
        <Brain className="w-6 h-6 text-blue-400 absolute -bottom-1 -right-1" />
      </div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
        Learning League
      </span>
    </div>
  );
};