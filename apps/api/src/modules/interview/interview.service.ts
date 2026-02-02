import { Injectable } from '@nestjs/common';
import { SchemaType } from '@google/generative-ai';
import { GeminiClientService } from '../ai/gemini-client.service';
import { InterviewConfig, Message, Feedback } from '../../types';

const INTERVIEW_SYSTEM_PROMPT = `
你是一位资深的面试官，正在进行一场专业的模拟面试。
你的目标是：
1. 根据用户的职位、公司和经验水平提出专业且具有挑战性的问题。
2. 保持面试的真实感，语气专业、客观，偶尔给出适当的追问。
3. 每次只提一个问题，并等待用户回答。
4. 在面试开始时，先进行简单的自我介绍并抛出第一个问题。
5. 面试通常持续 5-8 个回合。如果觉得面试足够充分，可以礼貌地结束面试。
6. 全程使用中文交流。
`;

const EVALUATION_SYSTEM_PROMPT = `
你是一位资深的 HR 专家。请基于面试对话记录进行【证据导向】的评估。
- 优点 (pros) 必须引用候选人的原话或具体案例。
- 不足 (cons) 需指出是能力缺失还是表达不清晰。
- 评分 (score) 需严苛，避免全员高分。
`;

@Injectable()
export class InterviewService {
  constructor(private geminiClient: GeminiClientService) {}

  /**
   * 获取配置了系统指令的模型实例
   */
  private getInterviewModel(config: InterviewConfig) {
    const systemInstruction = `${INTERVIEW_SYSTEM_PROMPT}
当前面试背景：
- 职位：${config.jobTitle}
- 目标公司：${config.company}
- 经验水平：${config.experienceLevel}
- 面试类型：${config.interviewType}
- 额外信息：${config.customDescription}
`;

    return this.geminiClient.getModel(
      {
        model: 'gemini-2.5-flash',
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemInstruction }],
        },
      },
      {
        apiVersion: 'v1beta',
      },
    );
  }

  async startInterview(config: InterviewConfig) {
    const model = this.getInterviewModel(config);
    // 第一次调用直接生成内容，不需要 startChat 的历史限制
    const result = await model.generateContent('你好，请开始我的模拟面试。');
    return result.response.text();
  }

  async sendMessage(
    history: Message[],
    newMessage: string,
    config: InterviewConfig,
  ) {
    const model = this.getInterviewModel(config);
    const chatHistory = history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Gemini 要求对话历史的第一条消息必须 is 'user'，上文开始对话已经处理过了，这里做下边界错误处理
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: '开始面试' }],
      });
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  }

  async getFeedback(
    history: Message[],
    config: InterviewConfig,
  ): Promise<Feedback> {
    const historyText = history
      .map((m) => `${m.role === 'user' ? '候选人' : '面试官'}: ${m.text}`)
      .join('\n');

    const evaluationModel = this.geminiClient.getModel(
      {
        model: 'gemini-2.5-pro',
        systemInstruction: {
          role: 'system',
          parts: [{ text: EVALUATION_SYSTEM_PROMPT }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              score: { type: SchemaType.NUMBER, description: '综合评分 0-100' },
              pros: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              cons: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              overallSummary: { type: SchemaType.STRING },
            },
            required: ['score', 'pros', 'cons', 'suggestions', 'overallSummary'],
          },
        },
      }
    );

    const prompt = `
请评估以下面试记录：
面试背景：${config.jobTitle} at ${config.company} (${config.experienceLevel})
对话历史：
${historyText}
`;

    try {
      const result = await evaluationModel.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text.trim());
    } catch (e) {
      console.error('Failed to parse evaluation JSON. Raw text:', e);
      // 增加容错：如果解析失败，抛出更友好的异常
      throw new Error('AI 评估报告生成失败，请稍后重试');
    }
  }
}
