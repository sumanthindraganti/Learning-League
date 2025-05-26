import React from 'react';
import { ChevronLeft, Lock, CheckCircle, Play, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Level } from '../types';
import { useUser } from '../context/UserContext';

const levels: Level[] = [
  {
    id: 1,
    name: "Level 1: Introduction to C",
    locked: false,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Learn the basics of C programming language"
  },
  {
    id: 2,
    name: "Level 2: Basic Syntax & I/O",
    locked: true,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Master input/output operations and syntax"
  },
  {
    id: 3,
    name: "Level 3: Logical Sequencing",
    locked: true,
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Understand program flow and logical operations"
  },
  {
    id: 4,
    name: "Level 4: Control Structures",
    locked: true,
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Learn loops and conditional statements"
  },
  {
    id: 5,
    name: "Level 5: Debugging Basics",
    locked: true,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Find and fix common programming errors"
  },
  {
    id: 6,
    name: "Level 6: Arrays",
    locked: true,
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Work with data collections and arrays"
  },
  {
    id: 7,
    name: "Level 7: Functions",
    locked: true,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Create reusable code with functions"
  },
  {
    id: 8,
    name: "Level 8: Memory Management",
    locked: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80",
    description: "Understand pointers and memory allocation"
  }
];

export const LevelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress } = useUser();

  // Function to check if a level is unlocked
  const isLevelUnlocked = (levelId: number) => {
    // Level 1 is always unlocked
    if (levelId === 1) return true;
    
    // Check if previous level is completed
    return userProgress.completedLevels.includes(levelId - 1);
  };

  const handleLevelClick = (levelId: number) => {
    if (isLevelUnlocked(levelId)) {
      navigate(`/level/${levelId}`);
    }
  };

  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const isCompleted = userProgress.completedLevels.includes(level.id);
            const isCurrent = level.id === userProgress.currentLevel;
            const isUnlocked = isLevelUnlocked(level.id);
            
            return (
              <div
                key={level.id}
                className={`relative overflow-hidden rounded-xl group ${
                  isUnlocked ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-75'
                } transition-all duration-300`}
                onClick={() => isUnlocked && handleLevelClick(level.id)}
              >
                {/* Image with overlay */}
                <div className="relative h-48">
                  <img 
                    src={level.image} 
                    alt={level.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{level.name}</h3>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : !isUnlocked && (
                      <Lock className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  
                  <p className="text-white/70 mb-4 text-sm">{level.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${
                      isCompleted ? 'text-green-400' :
                      isCurrent ? 'text-blue-400' :
                      !isUnlocked ? 'text-red-400' :
                      'text-white/70'
                    }`}>
                      {isCompleted ? 'Completed' :
                       isCurrent ? 'Current Level' :
                       !isUnlocked ? 'Complete previous level to unlock' :
                       'Ready to start'}
                    </p>

                    {isUnlocked && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-opacity bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                      >
                        {isCompleted ? (
                          <>
                            <RotateCw className="w-4 h-4" />
                            Replay
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Start
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};