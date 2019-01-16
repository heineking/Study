import { Handlers } from "./worker/types";
import { createWorker } from "./worker";

async function bindFunctions(worker: Handlers): Promise<any> {
  const { api } = await worker.ping();

  const proxy: any = function proxied(...args: any) {
    return worker.exec('default', ...args);
  };

  for(const fname of api) {
    proxy[fname] = (...args: any[]) => {
      return worker.exec(fname, ...args);
    };
  }

  return proxy;
}

export default class Farm {
  private max: number;
  private pool: Handlers[] = [];
  private idle: Handlers[] = [];
  private waiting: Array<{ reject: any, resolve: any }> = [];
  private file: string;

  public constructor(file: string) {
    this.max = 4;
    this.file = file;
  }

  public async acquire(): Promise<any> {
    return bindFunctions(await this.create());
  }

  public async end(): Promise<void> {
    this.pool.forEach((worker) => worker.exit(0));
  }

  private async create(): Promise<Handlers> {
    const worker = createWorker();
    this.pool.push(worker);
    await worker.load(this.file);
    return worker;
  }
}
