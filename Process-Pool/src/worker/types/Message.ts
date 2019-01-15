import { Handlers } from "./Handlers";

export interface Message {
  messageId: number;
  type: keyof Handlers,
  status?: 'ok' | 'error',
  payload: any,
}