import ProcessPool, { ProcessPoolOptions } from './ProcessPool';

class ProcessFork {
  private file: string;
  private pool: ProcessPool;
  private poolOptions?: ProcessPoolOptions;

  public constructor(file: string, options?: ProcessPoolOptions) {
    this.file = file;
    this.poolOptions = options;
  }

  public kill(): void {
    if (this.pool) {
      this.pool.kill();
    }
  }

  public run<TResult>(payload: any): Promise<TResult> {
    if (!this.pool) {
      this.pool = new ProcessPool(this.file, this.poolOptions);
    }
    return new Promise<TResult>(async (resolve, reject) => {
      const worker = await this.pool.acquire();
      worker.send({ type: 'run', payload });
      const handler = (message: any) => {
        const { type, payload } = message;
        if (type === 'ret') {
          resolve(payload);
        } else if (type === 'error') {
          reject(new Error(payload));
        }
        worker.removeListener('message', handler);
        this.pool.release(worker);
      };
      worker.addListener('message', handler);
    });
  }
}

export default ProcessFork;
