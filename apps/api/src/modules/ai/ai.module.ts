import { Module, Global } from '@nestjs/common';
import { GeminiClientService } from './gemini-client.service';
import { AiController } from './ai.controller';

@Global()
@Module({
  controllers: [AiController],
  providers: [GeminiClientService],
  exports: [GeminiClientService],
})
export class AiModule {}

