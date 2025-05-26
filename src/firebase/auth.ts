import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { saveUserProgress } from './db';

// Register a new user
export const registerUser = async (email: string, password: string, username?: string) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (username && user) {
      await updateProfile(user, {
        displayName: username
      });
      
      await saveUserProgress(user.uid, {
        username,
        currentLevel: 1,
        completedLevels: [],
        gamePoints: 0,
        quizPoints: 0,
        totalPoints: 0
      });
    }
    
    return { user };
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Handle specific error cases
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please try again.');
    }
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen for auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};