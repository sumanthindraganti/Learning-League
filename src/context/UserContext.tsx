import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { useAuth } from './AuthContext';
import { getUserProgress, saveUserProgress } from '../firebase/db';

interface UserContextType {
  userProgress: UserProgress;
  updateProgress: (progress: Partial<UserProgress>) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    username: 'Explorer',
    currentLevel: 1,
    completedLevels: [],
    gamePoints: 0,
    quizPoints: 0,
    totalPoints: 0,
    levelScores: {},
    bestLevelScores: {}
  });

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const progress = await getUserProgress(currentUser.uid);
          if (progress) {
            setUserProgress(progress);
          } else {
            // Create default progress for new user
            const defaultProgress = {
              username: currentUser.displayName || 'Explorer',
              currentLevel: 1,
              completedLevels: [],
              gamePoints: 0,
              quizPoints: 0,
              totalPoints: 0,
              levelScores: {},
              bestLevelScores: {}
            };
            await saveUserProgress(currentUser.uid, defaultProgress);
            setUserProgress(defaultProgress);
          }
        } catch (error) {
          console.error('Error fetching user progress:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [currentUser]);

  const updateProgress = async (progress: Partial<UserProgress>) => {
    // Calculate new total points
    const newGamePoints = progress.gamePoints ?? userProgress.gamePoints;
    const newQuizPoints = progress.quizPoints ?? userProgress.quizPoints;
    const totalPoints = newGamePoints + newQuizPoints;

    const updatedProgress = {
      ...userProgress,
      ...progress,
      totalPoints,
      gamePoints: newGamePoints,
      quizPoints: newQuizPoints
    };
    
    setUserProgress(updatedProgress);
    
    if (currentUser) {
      try {
        await saveUserProgress(currentUser.uid, updatedProgress);
      } catch (error) {
        console.error('Error updating user progress:', error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userProgress, updateProgress, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};