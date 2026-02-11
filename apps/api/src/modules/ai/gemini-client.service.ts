import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, ModelParams, RequestOptions } from '@google/generative-ai';
import { requestContext } from '../../common/context/request-context';

/**
 * Gemini 客户端服务
 * 负责与 Google Generative AI SDK 交互，管理 API Key、Base URL 及模型实例化
 */
@Injectable()
export class GeminiClientService implements OnModuleInit {
  private defaultGenAI!: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {}

  /**
   * 模块初始化时检查并初始化 SDK
   */
  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.defaultGenAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * 内部私有方法：获取当前请求应使用的客户端
   */
  private getSdkInstance(): GoogleGenerativeAI {
    const context = requestContext.getStore();
    const customApiKey = context?.apiKey;
    console.log('用户自定义API Key:', customApiKey);

    if (customApiKey) {
      return new GoogleGenerativeAI(customApiKey);
    }
    return this.defaultGenAI;
  }

  /**
   * 验证 API Key 是否有效
   * @param apiKey 待验证的 API Key
   */
  async validateKey(apiKey: string): Promise<{ success: boolean; message?: string }> {
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL') || 'https://generativelanguage.googleapis.com';
    const apiVersion = this.configService.get<string>('GEMINI_API_VERSION') || 'v1beta';
    const url = `${baseUrl}/${apiVersion}/models?key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'API Key 验证失败，请检查 Key 是否正确或网络是否连通' 
      };
    }
  }

  /**
   * 获取指定的生成模型实例
   * @param params 模型参数 (如 model ID)
   * @param options 请求配置 (如 apiVersion)
   */
  getModel(params: ModelParams, options?: RequestOptions): GenerativeModel {
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL');
    const apiVersion = this.configService.get<string>('GEMINI_API_VERSION') || 'v1beta';
    const sdk = this.getSdkInstance();
    return sdk.getGenerativeModel(
      params,
      {
        baseUrl: baseUrl || undefined,
        apiVersion: options?.apiVersion || apiVersion,
        ...options,
      },
    );
  }

  /**
   * 获取底层 SDK 实例
   */
  getSdk(): GoogleGenerativeAI {
    return this.getSdkInstance();
  }

  /**
   * 列出支持的 AI 模型
   * 包含过滤逻辑，只保留高性能且支持 generateContent 的 Flash 系列模型
   */
  async listModels() {
    const context = requestContext.getStore();
    const apiKey = context?.apiKey || this.configService.get<string>('GEMINI_API_KEY');
    
    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL') || 'https://generativelanguage.googleapis.com';
    const apiVersion = this.configService.get<string>('GEMINI_API_VERSION') || 'v1beta';

    const url = `${baseUrl}/${apiVersion}/models?key=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data = await response.json();
      
      // 过滤策略：
      // 1. 必须支持 generateContent 方法
      // 2. 属于 flash 系列（响应快、性价比高）
      // 3. 针对性保留 2.x 和 3.x 版本
      return data.models
        .filter((m: any) => 
          m.supportedGenerationMethods.includes('generateContent') && 
          m.name.includes('flash') &&
          (m.name.includes('2') || m.name.includes('2.5') || m.name.includes('3'))
        )
        .map((m: any) => ({
          name: m.name,
          id: m.name.split('/')[1],
          displayName: m.displayName,
          description: m.description,
        }));
    } catch (error) {
      console.error('Error listing models:', error);
      // 网络或权限失败时的兜底方案
      return [
        { id: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', description: '下一代极速模型，性能与速度的最佳平衡' },
        { id: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash (Experimental)', description: '实验性的极速模型' },
      ];
    }
  }
}

