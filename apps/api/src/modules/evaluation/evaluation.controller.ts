import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { InterviewConfig, Message } from '../../types';

@Controller('ai')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post('feedback')
  async getFeedback(
    @Body() body: { history: Message[]; config: InterviewConfig },
  ) {
    const feedback = await this.evaluationService.getFeedback(
      body.history,
      body.config,
    );
    return feedback;
  }
}

