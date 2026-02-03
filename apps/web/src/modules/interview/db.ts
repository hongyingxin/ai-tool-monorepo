import type { InterviewConfig, Message, Feedback } from './types';

/**
 * 存储在本地 IndexedDB 中的面试记录格式
 */
export interface InterviewRecord {
  /** 唯一标识符 (UUID) */
  id: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 当时面试的配置信息 */
  config: InterviewConfig;
  /** 完整的对话历史记录 */
  history: Message[];
  /** AI 生成的评估报告 */
  feedback: Feedback;
}

const DB_NAME = 'InterviewDB';
const STORE_NAME = 'interviews';
const DB_VERSION = 1;

/**
 * 基于浏览器 IndexedDB 的面试记录持久化类
 */
export class InterviewDB {
  private db: IDBDatabase | null = null;

  /**
   * 获取或初始化数据库连接
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // 创建存储空间，使用 id 作为主键
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * 保存面试记录
   * @param record 面试记录对象
   */
  async saveInterview(record: InterviewRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 获取所有历史面试记录
   * @returns 排序后的面试记录数组（按时间倒序）
   */
  async getAllInterviews(): Promise<InterviewRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // 按时间倒序排列，最新的在前
        const records = request.result as InterviewRecord[];
        resolve(records.sort((a, b) => b.createdAt - a.createdAt));
      };
    });
  }

  /**
   * 根据 ID 查询特定面试记录
   * @param id 面试记录 ID
   */
  async getInterviewById(id: string): Promise<InterviewRecord | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * 删除指定的面试记录
   * @param id 面试记录 ID
   */
  async deleteInterview(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/** 导出单例对象供全局使用 */
export const interviewDB = new InterviewDB();
