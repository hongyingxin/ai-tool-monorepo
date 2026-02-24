import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ResumeAnalysisResult } from './types';

interface ResumeState {
  extractedText: string;
  fileName: string;
  targetJobDescription: string;
  analysisReport: ResumeAnalysisResult | null;
  
  // Actions
  setExtractedText: (text: string) => void;
  setFileName: (name: string) => void;
  setTargetJobDescription: (jd: string) => void;
  setAnalysisReport: (report: ResumeAnalysisResult | null) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      extractedText: '',
      fileName: '',
      targetJobDescription: '',
      analysisReport: null,

      setExtractedText: (text) => set({ extractedText: text }),
      setFileName: (name) => set({ fileName: name }),
      setTargetJobDescription: (jd) => set({ targetJobDescription: jd }),
      setAnalysisReport: (report) => set({ analysisReport: report }),
      reset: () => set({
        extractedText: '',
        fileName: '',
        targetJobDescription: '',
        analysisReport: null,
      }),
    }),
    {
      name: 'resume-storage', // 存储在 localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

