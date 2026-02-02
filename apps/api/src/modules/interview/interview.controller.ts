import { Controller, Post, Body } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewConfig, Message } from '../../types';

@Controller('ai')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  /**
   * 开始模拟面试
   * @param config 面试配置（职位、公司、经验水平等）
   * @returns AI 生成的面试开场白
   */
  @Post('start')
  async startInterview(@Body() config: InterviewConfig) {
    const text = await this.interviewService.startInterview(config);
    return { text };
  }

  /**
   * 继续面试对话
   * @param body 包含对话历史、新消息和面试配置的对象
   * @returns AI 生成的回复
   */
  @Post('chat')
  async sendMessage(
    @Body()
    body: {
      history: Message[];
      message: string;
      config: InterviewConfig;
    },
  ) {
    const text = await this.interviewService.sendMessage(
      body.history,
      body.message,
      body.config,
    );
    return { text };
  }

  /**
   * 获取面试反馈报告
   * @param body 包含对话历史和面试配置的对象
   * @returns 包含评分、优点、不足和建议的反馈报告
   */
  @Post('feedback')
  async getFeedback(
    @Body() body: { history: Message[]; config: InterviewConfig },
  ) {
    const feedback = await this.interviewService.getFeedback(
      body.history,
      body.config,
    );
    return feedback;
  }
}
