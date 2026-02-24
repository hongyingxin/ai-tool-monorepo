import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// 直接从本地 node_modules 引入 worker 文件的 URL
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// 配置 PDF.js 使用本地 worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * 解析上传的简历文件（PDF 或 DOCX）并提取文本内容
 * @param file 用户上传的文件对象
 * @returns 提取出的纯文本内容
 */
export const parseResumeFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return parsePdf(file);
  } else if (extension === 'docx') {
    return parseDocx(file);
  } else {
    throw new Error('不支持的文件格式。目前仅支持 PDF 和 DOCX 格式。');
  }
};

/**
 * 解析 PDF 文件内容
 */
const parsePdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // 加载文档
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    // 遍历每一页提取文本
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // 将页面内的文本项合并，并简单处理换行
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF 解析失败:', error);
    throw new Error('PDF 内容解析失败，请确保文件未加密且包含可选中的文本。');
  }
};

/**
 * 解析 DOCX 文件内容
 */
const parseDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // 使用 mammoth 提取原始文本内容
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX 解析失败:', error);
    throw new Error('Word 文档内容解析失败，请尝试将其转换为 PDF 后再次上传。');
  }
};

