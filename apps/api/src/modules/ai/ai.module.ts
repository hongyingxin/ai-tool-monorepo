import { Module, Global } from '@nestjs/common';
import { GeminiClientService } from './gemini-client.service';
import { AiController } from './ai.controller';

/**
 * AI 核心模块
 * 提供对 Google Gemini 及其它 AI 服务的统一封装和 API 访问
 * 标记为 @Global() 以便在整个应用中直接注入 GeminiClientService
 */
@Global()
@Module({
  controllers: [AiController],
  providers: [GeminiClientService],
  exports: [GeminiClientService],
})
export class AiModule {}

