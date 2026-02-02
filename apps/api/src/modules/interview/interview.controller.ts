import { Controller, Post, Body } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewConfig, Message } from '../../types';

@Controller('ai')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post('start')
  async startInterview(@Body() config: InterviewConfig) {
    const text = await this.interviewService.startInterview(config);
    return { text };
  }

  @Post('chat')
  async sendMessage(@Body() body: { history: Message[]; message: string }) {
    const text = await this.interviewService.sendMessage(
      body.history,
      body.message,
    );
    return { text };
  }
}

