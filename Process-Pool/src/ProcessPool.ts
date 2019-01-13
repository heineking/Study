import { fork, ChildProcess } from 'child_process';
import * as os from 'os';

export interface ProcessPoolOptions {
  maxPools: number;
}

const defaultProcessPoolOptions: ProcessPoolOptions = {
  maxPools: os.cpus().length,
};

class ProcessPool {
  private file: string;
  private options: ProcessPoolOptions;
  private pool: ChildProcess[] = [];
  private idle: ChildProcess[] = [];
  private waiting: Array<{ resolve: Function, reject: Function }> = [];

  public get count(): number {
    return this.pool.length;
  }

  constructor(file: string, options: ProcessPoolOptions = defaultProcessPoolOptions) {
    this.file = file;
    this.options = options;
  }

  public async acquire(): Promise<ChildProcess> {
    if (this.count < this.options.maxPools) {
      const forked = fork(this.file);
      this.pool.push(forked);
      this.idle.push(forked);
    }
    const process = this.idle.shift();
    if (process) {
      return process;
    }
    return new Promise<ChildProcess>((resolve, reject) => {
      this.waiting.push({ resolve, reject });
    });
  }

  public release(process: ChildProcess): void {
    const next = this.waiting.shift();
    if (next) {
      next.resolve(process);
    } else {
      this.idle.push(process);
    }
  }

  public kill(): void {
    this.pool.forEach(child => child.kill());
    this.waiting.forEach(({ reject }) => reject(new Error('kill')));
  }
}

export default ProcessPool;
