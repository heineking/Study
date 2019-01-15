import { State } from "./State";

export interface Handlers {
  exec(args: any): Promise<any>;
  load(args: any): Promise<void>;
  ping(args: any): Promise<State>;
}