import { AsyncLocalStorage } from 'async_hooks';

export interface IRequestContext {
  apiKey?: string;
}

export const requestContext = new AsyncLocalStorage<IRequestContext>();

