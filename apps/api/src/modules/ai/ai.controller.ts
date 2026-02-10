import { Controller, Get, Body, Sse, MessageEvent, Post } from '@nestjs/common';
import { GeminiClientService } from './gemini-client.service';
import { Observable } from 'rxjs';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
}

@Controller('ai')
export class AiController {
  constructor(private readonly geminiClient: GeminiClientService) {}

  @Get('models')
  async getModels() {
    return this.geminiClient.listModels();
  }

  @Post('chat/stream')
  @Sse()
  chatStream(@Body() body: ChatRequest): Observable<MessageEvent> {
    const { model: modelId, messages } = body;
    
    // 准备历史记录（排除最后一条作为当前输入）
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const currentMessage = messages[messages.length - 1].content;

    const model = this.geminiClient.getModel({ model: modelId });
    const chat = model.startChat({ history });

    return new Observable((subscriber) => {
      (async () => {
        try {
          const result = await chat.sendMessageStream(currentMessage);
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            subscriber.next({ data: { text: chunkText } } as MessageEvent);
          }
          subscriber.complete();
        } catch (error: any) {
          console.error('Chat stream error:', error);
          subscriber.next({ data: { error: error.message || 'Stream error' } } as MessageEvent);
          subscriber.complete();
        }
      })();
    });
  }
}

