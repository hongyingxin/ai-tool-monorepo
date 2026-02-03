export enum InterviewStatus {
  IDLE = 'IDLE',
  CONFIGURING = 'CONFIGURING',
  INTERVIEWING = 'INTERVIEWING',
  COMPLETED = 'COMPLETED',
  HISTORY = 'HISTORY',
  VIEWING_HISTORY = 'VIEWING_HISTORY'
}

export interface InterviewConfig {
  jobTitle: string;
  company: string;
  experienceLevel: string;
  interviewType: 'technical' | 'behavioral' | 'general';
  customDescription: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  type?: 'text' | 'choice';
  options?: string[];
  isError?: boolean;
}

export interface InterviewResponse {
  content: string;
  type: 'text' | 'choice';
  options?: string[];
}

export interface Feedback {
  score: number;
  pros: string[];
  cons: string[];
  suggestions: string[];
  overallSummary: string;
}

