export interface LeaderboardEntry {
  id: string;
  username: string;
  totalPoints: number;
  gamePoints: number;
  quizPoints: number;
  completedLevels: number[];
  bestLevelScores?: { [key: string]: number };
}

export interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizReportQuestion {
  question: QuizQuestion;
  userAnswer: number;
  correct: boolean;
  usedHint?: boolean;
  attemptedAnswer?: string;
  attempts?: number;
}

export interface UserProgress {
  username: string;
  currentLevel: number;
  completedLevels: number[];
  gamePoints: number;
  quizPoints: number;
  totalPoints: number;
  levelScores?: {
    [key: string]: {
      bestScore: number;
      attempts?: number;
    };
  };
  bestLevelScores?: {
    [key: string]: number;
  };
}

export interface Level {
  id: number;
  name: string;
  locked: boolean;
  image: string;
  description: string;
}