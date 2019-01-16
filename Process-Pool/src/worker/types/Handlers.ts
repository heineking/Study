import { State } from "./State";

export interface Handlers {
  exec(...args: any[]): Promise<any>;
  exit(...args: any[]): Promise<void>;
  load(...args: any[]): Promise<void>;
  ping(...args: any[]): Promise<State>;
}