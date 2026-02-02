import { Injectable } from '@nestjs/common';
import { SchemaType } from '@google/generative-ai';
import { GeminiClientService } from '../ai/gemini-client.service';
import { InterviewConfig, Message, Feedback } from '../../types';

const EVALUATION_SYSTEM_PROMPT = `
你是一位资深的 HR 专家，负责对模拟面试的表现进行复盘评估。
请根据面试对话记录，给出一个详细的反馈报告。
必须返回符合 JSON 格式的数据。
`;

@Injectable()
export class EvaluationService {
  constructor(private geminiClient: GeminiClientService) {}

  async getFeedback(
    history: Message[],
    config: InterviewConfig,
  ): Promise<Feedback> {
    const historyText = history
      .map((m) => `${m.role === 'user' ? '候选人' : '面试官'}: ${m.text}`)
      .join('\n');

    const evaluationModel = this.geminiClient.getModel(
      {
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              score: { type: SchemaType.NUMBER, description: '综合评分 0-100' },
              pros: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: '优点列表',
              },
              cons: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: '不足之处列表',
              },
              suggestions: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: '改进建议列表',
              },
              overallSummary: { type: SchemaType.STRING, description: '综合总结' },
            },
            required: ['score', 'pros', 'cons', 'suggestions', 'overallSummary'],
          },
        },
      },
      {
        apiVersion: 'v1beta',
      },
    );

    const prompt = `
请评估以下面试记录：
面试背景：${config.jobTitle} at ${config.company} (${config.experienceLevel})
对话历史：
${historyText}

系统要求：${EVALUATION_SYSTEM_PROMPT}
`;

    const result = await evaluationModel.generateContent(prompt);
    try {
      return JSON.parse(result.response.text().trim());
    } catch (e) {
      console.error('Failed to parse evaluation JSON', e);
      throw new Error('评估结果解析失败');
    }
  }
}

