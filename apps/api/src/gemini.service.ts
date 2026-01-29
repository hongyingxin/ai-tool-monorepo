import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { InterviewConfig, Message, Feedback } from './types';

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
你是一位资深的 HR 专家，负责对模拟面试的表现进行复盘评估。
请根据面试对话记录，给出一个详细的反馈报告。
必须返回符合 JSON 格式的数据。
`;

@Injectable()
export class GeminiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel(
      {
        model: 'gemini-2.5-flash',
      },
      {
        baseUrl: baseUrl || undefined,
        // apiVersion: 'v1beta', // 改回 v1beta，这是 Flash 模型的标准版本
      },
    );
  }

  async startInterview(config: InterviewConfig) {
    const systemInstruction = `${INTERVIEW_SYSTEM_PROMPT}
当前面试背景：
- 职位：${config.jobTitle}
- 目标公司：${config.company}
- 经验水平：${config.experienceLevel}
- 面试类型：${config.interviewType}
- 额外信息：${config.customDescription}
`;

    const chat = this.model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(`[系统指令：${systemInstruction}]\n\n你好，请开始我的模拟面试。`);
    return result.response.text();
  }

  async sendMessage(history: Message[], newMessage: string) {
    const chatHistory = history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const chat = this.model.startChat({
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

    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL');
    const evaluationModel = this.genAI.getGenerativeModel(
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
        baseUrl: baseUrl || undefined,
        apiVersion: 'v1beta', // 改回 v1beta
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
