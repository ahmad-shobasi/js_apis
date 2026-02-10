import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  requestId: string;
  //   userId?: number;
  sessionId?: string;
}

export const RequestContext = new AsyncLocalStorage<RequestContextData>();
