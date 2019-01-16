import { Handlers } from "./worker/types";
import { createWorker } from "./worker";

interface FarmOptions {
  maxPool: number;
}

const defaultFarmOptions: FarmOptions = {
  maxPool: 4,
};

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
  private options: FarmOptions;
  private file: string;
  private pool: Handlers[] = [];

  private idle: any[] = [];
  private waiting: Array<{ resolve: Function, reject: Function }> = [];


  public constructor(file: string, options: FarmOptions = defaultFarmOptions) {
    this.options = options;
    this.file = file;
  }

  public async acquire(): Promise<any> {
    if (this.idle.length > 0) {
      return this.idle.shift();
    }
    if (this.pool.length < this.options.maxPool) {
      await this.create();
      return this.idle.shift();
    }
    return new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject });
    });
  }

  public release(proxied: any): void {
    const next = this.waiting.shift();
    if (next) {
      next.resolve(proxied);
    } else {
      this.idle.push(proxied);
    }
  }

  public async end(code: number = 0): Promise<void> {
    this.pool.forEach((worker) => worker.exit(code));
  }

  private async create(): Promise<void> {
    const worker = createWorker();
    this.pool.push(worker);
    await worker.load(this.file);
    this.idle.push(await bindFunctions(worker));
  }
}
