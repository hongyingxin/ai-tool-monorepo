import type { ChatMessage } from './api';

/**
 * 聊天会话记录定义
 */
export interface ChatSession {
  /** 会话唯一标识 (UUID) */
  id: string;
  /** 会话标题（通常取第一条消息） */
  title: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 最后更新时间戳 */
  updatedAt: number;
  /** 完整的历史对话记录 */
  messages: ChatMessage[];
  /** 所使用的 AI 模型 ID */
  modelId: string;
}

const DB_NAME = 'ChatDB';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;

/**
 * 基于浏览器 IndexedDB 的聊天记录持久化管理类
 */
export class ChatDB {
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
          // 创建以 id 为主键的存储对象
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * 保存或更新会话记录
   * @param session 会话对象
   */
  async saveSession(session: ChatSession): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(session);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * 获取所有会话列表
   * @returns 按更新时间倒序排列的会话数组
   */
  async getAllSessions(): Promise<ChatSession[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const records = request.result as ChatSession[];
        // 确保最新的会话排在最前面
        resolve(records.sort((a, b) => b.updatedAt - a.updatedAt));
      };
    });
  }

  /**
   * 根据 ID 获取特定会话详情
   * @param id 会话 ID
   */
  async getSessionById(id: string): Promise<ChatSession | undefined> {
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
   * 删除指定会话
   * @param id 会话 ID
   */
  async deleteSession(id: string): Promise<void> {
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

/** 导出单例实例 */
export const chatDB = new ChatDB();

