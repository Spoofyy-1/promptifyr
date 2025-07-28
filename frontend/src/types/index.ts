// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  badges: string[];
  challengesCompleted: string[];
  joinedAt: string;
  lastActive: string;
  currentLevel: number;
  pointsToNextLevel: number;
}

// Challenge types
export interface Challenge {
  _id: string;
  title: string;
  description: string;
  task: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  icon: string;
  inputContent: string;
  expectedOutput: string;
  rubric: {
    clarity: number;
    correctness: number;
    hallucinationFree: number;
  };
  points: number;
  isActive: boolean;
  order: number;
  hints: string[];
  flawedPromptExample?: string;
  createdAt: string;
  updatedAt: string;
  difficultyColor: string;
}

// Prompt Version types
export interface PromptVersion {
  _id: string;
  userId: string;
  challengeId: string;
  promptText: string;
  version: number;
  response: string;
  score: {
    total: number;
    clarity: number;
    correctness: number;
    hallucinationFree: number;
  };
  feedback: string;
  hallucinationFlags: string[];
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  gradeLetter: string;
  performanceLevel: string;
}

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
  earned?: boolean;
  progress?: number;
  current?: number;
  required?: number | null;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ListResponse<T> {
  success: boolean;
  count: number;
  data: T;
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

// Challenge submission types
export interface SubmissionData {
  prompt: string;
}

export interface SubmissionResponse {
  promptVersion: PromptVersion;
  suggestions?: string[];
}

// Quiz types
export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    name: string;
    points: number;
    level: number;
    badges: string[];
    challengesCompleted: number;
    joinedAt: string;
    lastActive: string;
  };
  stats: {
    totalSubmissions: number;
    averageScore: number;
  };
}

// Progress types
export interface ChallengeProgress {
  challenge: {
    _id: string;
    title: string;
    difficulty: string;
    points: number;
    category: string;
    icon: string;
  };
  bestScore: number;
  attempts: number;
  completed: boolean;
  gradeLetter: string | null;
  lastAttempt: string | null;
}

export interface CompletionRates {
  beginner: { total: number; completed: number };
  intermediate: { total: number; completed: number };
  advanced: { total: number; completed: number };
}

export interface UserProgress {
  challenges: ChallengeProgress[];
  completionRates: CompletionRates;
  totalCompleted: number;
  totalChallenges: number;
}

// UI State types
export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface LoadingState {
  [key: string]: boolean;
} 