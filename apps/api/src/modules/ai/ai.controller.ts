import { Controller, Get, Body, Sse, MessageEvent, Post } from '@nestjs/common';
import { GeminiClientService } from './gemini-client.service';
import { Observable } from 'rxjs';

/**
 * 附件结构
 */
interface ChatAttachment {
  type: 'image';
  data: string;
  mimeType: string;
}

/**
 * 聊天消息结构
 */
interface ChatMessage {
  /** 角色: user (用户), model (AI) */
  role: 'user' | 'model';
  /** 消息内容 */
  content: string;
  /** 附件列表 */
  attachments?: ChatAttachment[];
}

/**
 * 聊天请求 payload
 */
interface ChatRequest {
  /** 模型 ID */
  model: string;
  /** 对话历史（包含当前最新消息） */
  messages: ChatMessage[];
}

/**
 * 通用 AI 控制器
 * 处理模型列表获取、流式对话等基础 AI 功能
 */
@Controller('ai')
export class AiController {
  constructor(private readonly geminiClient: GeminiClientService) {}

  /**
   * 验证用户提供的 API Key
   */
  @Post('validate-key')
  async validateKey(@Body('key') key: string) {
    return this.geminiClient.validateKey(key);
  }

  /**
   * 获取支持的 AI 模型列表
   */
  @Get('models')
  async getModels() {
    return this.geminiClient.listModels();
  }

  /**
   * 发起流式对话
   * 使用 Server-Sent Events (SSE) 协议实现字符级的实时回复
   * @param body 包含模型 ID 和消息历史
   */
  @Post('chat/stream')
  @Sse()
  chatStream(@Body() body: ChatRequest): Observable<MessageEvent> {
    const { model: modelId, messages } = body;
    
    // 准备历史记录：Gemini 要求的格式，排除最后一条作为当前输入
    // 支持多模态内容 (文本 + 图片)
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [
        { text: m.content },
        ...(m.attachments || []).map(a => ({
          inlineData: { data: a.data, mimeType: a.mimeType }
        }))
      ],
    }));

    const lastMessage = messages[messages.length - 1];
    const currentParts = [
      { text: lastMessage.content },
      ...(lastMessage.attachments || []).map(a => ({
        inlineData: { data: a.data, mimeType: a.mimeType }
      }))
    ];

    // 获取模型并开启聊天会话
    const model = this.geminiClient.getModel({ model: modelId });
    const chat = model.startChat({ history });

    return new Observable((subscriber) => {
      (async () => {
        try {
          const result = await chat.sendMessageStream(currentParts);
          
          // 迭代读取流式响应块
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // 推送 SSE 数据包
            subscriber.next({ data: { text: chunkText } } as MessageEvent);
          }
          subscriber.complete();
        } catch (error: any) {
          console.error('Chat stream error:', error);
          // 发生错误时发送错误信息并关闭流
          subscriber.next({ data: { error: error.message || 'Stream error' } } as MessageEvent);
          subscriber.complete();
        }
      })();
    });
  }
}

