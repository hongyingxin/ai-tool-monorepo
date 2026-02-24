import { Injectable } from '@nestjs/common';
import { SchemaType } from '@google/generative-ai';
import { GeminiClientService } from '../ai/gemini-client.service';

@Injectable()
export class ResumeService {
  constructor(private readonly geminiClient: GeminiClientService) {}

  async analyzeResume(resumeText: string, jobDescription?: string) {
    const modelId = this.geminiClient.getPreferredModelId('gemini-2.0-flash');
    const model = this.geminiClient.getModel({
      model: modelId,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER, description: '综合评分 (0-100)' },
            match_analysis: { type: SchemaType.STRING, description: 'JD 匹配度深度分析' },
            red_flags: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING },
              description: '简历中的硬伤/减分项' 
            },
            highlights: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING },
              description: '亮点/加分项' 
            },
            key_optimizations: { 
              type: SchemaType.ARRAY, 
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  original: { type: SchemaType.STRING, description: '原始描述' },
                  suggestion: { type: SchemaType.STRING, description: '优化后的建议描述' },
                  reason: { type: SchemaType.STRING, description: '优化理由' },
                },
                required: ['original', 'suggestion']
              },
              description: '核心优化点建议'
            },
            missing_keywords: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING },
              description: '缺失的核心关键词/技术栈' 
            },
            optimized_resume: {
              type: SchemaType.STRING,
              description: '根据诊断建议完整重写后的 Markdown 格式简历内容'
            }
          },
          required: ['score', 'match_analysis', 'red_flags', 'key_optimizations', 'missing_keywords', 'highlights', 'optimized_resume'],
        },
      },
    });

    const prompt = `
你是一位拥有 10 年经验的资深大厂技术 HR 和简历优化专家，擅长使用【STAR 法则】和【谷歌简历公式：动词 + 任务 + 结果】来改写简历。

请深度分析以下简历，并结合目标岗位（JD）给出诊断。

### 目标岗位描述 (JD):
${jobDescription || '未提供，请根据行业通用高标准进行专业优化。'}

### 简历内容:
${resumeText}

### 优化要求（非常重要）：
1. **拒绝平庸**：不要只是把词组连成句子。要使用强有力的动词（如：主导、重构、攻克、节省、提升）开头。
2. **量化结果**：尽可能挖掘或引导用户体现数据（如：QPS、响应时间、部署频率、成本降低百分比等）。
3. **针对性**：如果提供了 JD，必须将简历中的经验与 JD 中的核心需求（如高并发、工程化、架构设计）进行对齐。
4. **JSON 字段规范**：
   - \`score\`: 给出严格的评分（不要全是 80、90 分）。
   - \`key_optimizations\`: 
     - \`original\`: 原始的平庸描述。
     - \`suggestion\`: **优化后的专业描述。必须使用 1-2 条精炼的 Bullet Points。** 示例： "主导前端监控基建从 0 到 1 的搭建，支撑日均 3000w+ PV 稳定性；自研 2KB 无侵入 SDK，将线上故障发现时效提升 40%。"
     - \`reason\`: 说明为什么要这样改（如：突出了技术影响力、强化了量化指标、符合 JD 对高并发的要求）。
   - \`optimized_resume\`: **这是最重要的输出。** 请根据你的所有诊断建议，将用户的原始简历内容完整地重构并转换为精美的 Markdown 格式。确保排版专业、结构清晰、逻辑性强，并已应用所有的优化建议。

请务必严格按照指定的 JSON 格式返回结果，所有字段的 Value 必须使用中文。
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }
}

