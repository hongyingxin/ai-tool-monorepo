import { Module, Global } from '@nestjs/common';
import { GeminiClientService } from './gemini-client.service';

@Global()
@Module({
  providers: [GeminiClientService],
  exports: [GeminiClientService],
})
export class AiModule {}

