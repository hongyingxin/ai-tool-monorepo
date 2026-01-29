import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { InterviewConfig, Message } from './types';

@Controller('ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('start')
  async startInterview(@Body() config: InterviewConfig) {
    const text = await this.geminiService.startInterview(config);
    return { text };
  }

  @Post('chat')
  async sendMessage(@Body() body: { history: Message[]; message: string }) {
    const text = await this.geminiService.sendMessage(
      body.history,
      body.message,
    );
    return { text };
  }

  @Post('feedback')
  async getFeedback(
    @Body() body: { history: Message[]; config: InterviewConfig },
  ) {
    const feedback = await this.geminiService.getFeedback(
      body.history,
      body.config,
    );
    return feedback;
  }
}
