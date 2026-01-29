export enum InterviewStatus {
  IDLE = 'IDLE',
  CONFIGURING = 'CONFIGURING',
  INTERVIEWING = 'INTERVIEWING',
  COMPLETED = 'COMPLETED',
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
}

export interface Feedback {
  score: number;
  pros: string[];
  cons: string[];
  suggestions: string[];
  overallSummary: string;
}
