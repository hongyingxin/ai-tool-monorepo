import { Injectable } from '@nestjs/common';
import { GeminiClientService } from '../ai/gemini-client.service';
import { InterviewConfig, Message } from '../../types';
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
@Injectable()
export class InterviewService {
  constructor(private geminiClient: GeminiClientService) {}

  private getInterviewModel() {
    return this.geminiClient.getModel({
      model: 'gemini-2.5-flash',
    });
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
    // 模拟面试开始逻辑
//     return `你好！我是你的面试官。很高兴今天能和你进行关于 ${config.jobTitle} 职位的模拟面试。我已经准备好了一些针对 ${config.company} 背景及 ${config.experienceLevel} 经验水平的问题。

// 那么，我们先从最基本的开始，请你做一个简单的自我介绍，并聊聊你为什么对这个职位感兴趣？`;
  }

  async sendMessage(history: Message[], newMessage: string) {
    const model = this.getInterviewModel();
    const chatHistory = history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  }
}

