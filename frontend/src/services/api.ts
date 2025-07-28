import axios from 'axios';
import {
  User,
  Challenge,
  PromptVersion,
  Badge,
  LoginData,
  RegisterData,
  AuthResponse,
  ApiResponse,
  ListResponse,
  SubmissionData,
  SubmissionResponse,
  Quiz,
  LeaderboardEntry,
  UserProgress
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
  
  getMe: (): Promise<ApiResponse<{ user: User }>> =>
    api.get('/auth/me').then(res => res.data),
  
  updateProfile: (data: Partial<User>): Promise<ApiResponse<{ user: User }>> =>
    api.put('/auth/profile', data).then(res => res.data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<{ message: string }>> =>
    api.put('/auth/password', data).then(res => res.data),
};

// Challenges API
export const challengesAPI = {
  getAll: (params?: { difficulty?: string; category?: string }): Promise<ListResponse<{ challenges: Challenge[] }>> =>
    api.get('/challenges', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<{ challenge: Challenge }>> =>
    api.get(`/challenges/${id}`).then(res => res.data),
  
  submit: (id: string, data: SubmissionData): Promise<ApiResponse<SubmissionResponse>> =>
    api.post(`/challenges/${id}/submit`, data).then(res => res.data),
  
  test: (id: string, data: SubmissionData): Promise<ApiResponse<{ response: string; version: number }>> =>
    api.post(`/challenges/${id}/test`, data).then(res => res.data),
  
  getVersions: (id: string): Promise<ListResponse<{ versions: PromptVersion[] }>> =>
    api.get(`/challenges/${id}/versions`).then(res => res.data),
  
  getQuiz: (id: string): Promise<ApiResponse<{ quiz: Quiz; flawedPrompt: string }>> =>
    api.get(`/challenges/${id}/quiz`).then(res => res.data),
};

// Users API
export const usersAPI = {
  getProfile: (): Promise<ApiResponse<{ user: User }>> =>
    api.get('/users/profile').then(res => res.data),
  
  getProgress: (): Promise<ApiResponse<UserProgress>> =>
    api.get('/users/progress').then(res => res.data),
  
  getLeaderboard: (params?: { timeframe?: string; limit?: number }): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[]; currentUserRank: number; timeframe: string }>> =>
    api.get('/users/leaderboard', { params }).then(res => res.data),
  
  getBadges: (): Promise<ApiResponse<{ badges: Badge[]; earnedCount: number; totalCount: number }>> =>
    api.get('/users/badges').then(res => res.data),
};

// Prompts API
export const promptsAPI = {
  getVersions: (challengeId: string): Promise<ListResponse<{ versions: PromptVersion[] }>> =>
    api.get(`/prompts/${challengeId}`).then(res => res.data),
  
  getVersion: (challengeId: string, version: number): Promise<ApiResponse<{ promptVersion: PromptVersion }>> =>
    api.get(`/prompts/${challengeId}/${version}`).then(res => res.data),
};

export default api; 