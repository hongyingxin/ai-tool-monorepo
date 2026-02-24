export interface ResumeAnalysisResult {
  /** 综合评分 (0-100) */
  score: number;
  /** JD 匹配度深度分析 */
  match_analysis: string;
  /** 简历中的硬伤/减分项 */
  red_flags: string[];
  /** 核心优化点建议 */
  key_optimizations: {
    /** 原始描述 */
    original: string;
    /** 优化后的建议描述 */
    suggestion: string;
    /** 优化理由 */
    reason?: string;
  }[];
  /** 缺失的核心关键词/技术栈 */
  missing_keywords: string[];
  /** 亮点/加分项 */
  highlights: string[];
  /** 优化后的完整简历 (Markdown) */
  optimized_resume: string;
}

export interface ResumeStore {
  extractedText: string;
  fileName: string;
  targetJobDescription: string;
  analysisReport: ResumeAnalysisResult | null;
}

