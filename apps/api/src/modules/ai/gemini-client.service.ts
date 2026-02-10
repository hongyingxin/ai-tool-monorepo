import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, ModelParams, RequestOptions } from '@google/generative-ai';

@Injectable()
export class GeminiClientService implements OnModuleInit {
  private genAI!: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  getModel(params: ModelParams, options?: RequestOptions): GenerativeModel {
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL');
    const apiVersion = this.configService.get<string>('GEMINI_API_VERSION') || 'v1beta';
    
    return this.genAI.getGenerativeModel(
      params,
      {
        baseUrl: baseUrl || undefined,
        apiVersion: options?.apiVersion || apiVersion,
        ...options,
      },
    );
  }

  getSdk(): GoogleGenerativeAI {
    return this.genAI;
  }

  async listModels() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL') || 'https://generativelanguage.googleapis.com';
    const apiVersion = this.configService.get<string>('GEMINI_API_VERSION') || 'v1beta';

    const url = `${baseUrl}/${apiVersion}/models?key=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data = await response.json();
      // 过滤逻辑：
      // 1. 支持 generateContent
      // 2. 包含 'flash' (Token 消耗低，响应快)
      // 3. 只保留 2.x 和 3.x 系列
      return data.models
        .filter((m: any) => 
          m.supportedGenerationMethods.includes('generateContent') && 
          m.name.includes('flash') &&
          (m.name.includes('2.5') || m.name.includes('3.0'))
        )
        .map((m: any) => ({
          name: m.name,
          id: m.name.split('/')[1],
          displayName: m.displayName,
          description: m.description,
        }));
    } catch (error) {
      console.error('Error listing models:', error);
      // Fallback 列表，仅保留高性价比的 Flash 模型 (2.0 及更高)
      return [
        { id: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', description: '下一代极速模型，性能与速度的最佳平衡' },
        { id: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash (Experimental)', description: '实验性的极速模型' },
      ];
    }
  }
}

