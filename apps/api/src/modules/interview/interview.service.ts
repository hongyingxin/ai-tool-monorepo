import { Injectable } from '@nestjs/common';
import { SchemaType } from '@google/generative-ai';
import { GeminiClientService } from '../ai/gemini-client.service';
import { InterviewConfig, Message, Feedback } from '../../types';
import { INTERVIEW_SYSTEM_PROMPT, EVALUATION_SYSTEM_PROMPT } from './prompts';
import { Observable } from 'rxjs';

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
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              content: { type: SchemaType.STRING, description: '面试官说的话或题目内容' },
              type: { type: SchemaType.STRING, enum: ['text', 'choice'], description: '题目类型' },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: '选择题选项，主观题为空' },
            },
            required: ['content', 'type'],
          },
        },
      }
    );
  }

  async startInterview(config: InterviewConfig) {
    console.log('[InterviewService] Starting interview with config:', JSON.stringify(config));
    const model = this.getInterviewModel(config);
    // 第一次调用直接生成内容，不需要 startChat 的历史限制
    const result = await model.generateContent('你好，请开始我的模拟面试。');
    const text = result.response.text();
    console.log('[InterviewService] First question generated:', text);
    // 兼容前端：返回 JSON 字符串，前端负责解析
    return text;
  }

  async sendMessage(
    history: Message[],
    newMessage: string,
    config: InterviewConfig,
  ) {
    console.log(`[InterviewService] Sending message. History length: ${history.length}, New message: ${newMessage}`);
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
    const text = result.response.text();
    console.log('[InterviewService] AI response:', text);
    return text;
  }

  getFeedbackStream(
    history: Message[],
    config: InterviewConfig,
  ): Observable<MessageEvent> {
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
        },
      }
    );

    const prompt = `
请评估以下面试记录：
面试背景：${config.jobTitle} at ${config.company} (${config.experienceLevel})
对话历史：
${historyText}
`;

    return new Observable((subscriber) => {
      (async () => {
        try {
          const result = await evaluationModel.generateContentStream(prompt);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            subscriber.next({ data: { text: chunkText } } as MessageEvent);
          }
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  async getFeedback(
    history: Message[],
    config: InterviewConfig,
  ): Promise<Feedback> {
    console.log(`[InterviewService] Generating feedback. History length: ${history.length}`);
    const historyText = history
      .map((m) => `${m.role === 'user' ? '候选人' : '面试官'}: ${m.text}`)
      .join('\n');

    const evaluationModel = this.geminiClient.getModel(
      {
        model: 'gemini-2.5-flash',
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
      console.log('[InterviewService] Raw feedback JSON:', text);
      return JSON.parse(text.trim());
    } catch (e) {
      console.error('Failed to parse evaluation JSON. Error:', e);
      // 增加容错：如果解析失败，抛出更友好的异常
      throw new Error('AI 评估报告生成失败，请稍后重试');
    }
  }
}
