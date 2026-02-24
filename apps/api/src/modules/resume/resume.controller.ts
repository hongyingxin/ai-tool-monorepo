import { Controller, Post, Body } from '@nestjs/common';
import { ResumeService } from './resume.service';

@Controller('ai/resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('analyze')
  async analyze(@Body() body: { resumeText: string; jobDescription?: string }) {
    const { resumeText, jobDescription } = body;
    return this.resumeService.analyzeResume(resumeText, jobDescription);
  }
}

