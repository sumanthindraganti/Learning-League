import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy,
  limit as firestoreLimit,
  getDocs
} from 'firebase/firestore';
import { db } from './config';
import { UserProgress, LeaderboardEntry } from '../types';

// Create or update user progress
export const saveUserProgress = async (userId: string, progress: Partial<UserProgress>) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      
      // Calculate total points from quiz and game points
      const totalPoints = (progress.quizPoints ?? currentData.quizPoints ?? 0) + 
                         (progress.gamePoints ?? currentData.gamePoints ?? 0);
      
      // Update user document
      await updateDoc(userRef, {
        ...progress,
        totalPoints,
        updatedAt: new Date(),
        public: true // Make user data public for leaderboard
      });
    } else {
      // Create new user with default values
      const totalPoints = (progress.quizPoints || 0) + (progress.gamePoints || 0);
      await setDoc(userRef, {
        username: progress.username || 'Explorer',
        currentLevel: progress.currentLevel || 1,
        completedLevels: progress.completedLevels || [],
        gamePoints: progress.gamePoints || 0,
        quizPoints: progress.quizPoints || 0,
        totalPoints,
        levelScores: progress.levelScores || {},
        bestLevelScores: progress.bestLevelScores || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        public: true // Make user data public for leaderboard
      });
    }
  } catch (error) {
    console.error('Error saving user progress:', error);
    return false;
  }
  return true;
};

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        username: data.username || 'Explorer',
        currentLevel: data.currentLevel || 1,
        completedLevels: data.completedLevels || [],
        gamePoints: data.gamePoints || 0,
        quizPoints: data.quizPoints || 0,
        totalPoints: data.totalPoints || 0,
        levelScores: data.levelScores || {},
        bestLevelScores: data.bestLevelScores || {}
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

// Get leaderboard data
export const getLeaderboard = async (limit = 10): Promise<LeaderboardEntry[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('totalPoints', 'desc'),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No leaderboard data found');
      return [];
    }

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username || 'Explorer',
        totalPoints: data.totalPoints || 0,
        gamePoints: data.gamePoints || 0,
        quizPoints: data.quizPoints || 0,
        completedLevels: data.completedLevels || [],
        bestLevelScores: data.bestLevelScores || {}
      };
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};