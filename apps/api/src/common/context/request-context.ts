import { AsyncLocalStorage } from 'async_hooks';

export interface IRequestContext {
  apiKey?: string;
  modelId?: string;
}

export const requestContext = new AsyncLocalStorage<IRequestContext>();

