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
}

