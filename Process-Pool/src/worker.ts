import { fork } from "child_process";

let $module: any = null;

interface State {
  file?: string;
  pid: number;
  loaded: boolean;
  api: string[];
}

const state: State = {
  // state
  file: undefined,
  get pid(): number {
    return process.pid;
  },
  // getters
  get loaded(): boolean {
    return !!$module;
  }, 
  get api(): string[] {
    if (!this.loaded) {
      return [];
    }
    return Object.keys($module);
  },
};

const handlers: any = {
  exec(payload: any): void {
    const { fname, args } = payload;
    const fn = $module[fname];
    const result = fn(...args);
    process.send({ type: 'result', payload: result });
  },
  load(file: string): void {
    state.file = file;
    $module = require(file);
  },
  ping(): void {
    process.send({
      type: 'ping',
      payload: state, 
    });
  }
};

export function createWorker() {
  const workerFile = require.resolve('./worker.ts');
  const tsnode = require.resolve('../node_modules/ts-node/dist/bin.js');
  const worker = fork(workerFile, [], { execArgv: [tsnode] });
  return {
    kill() {
      worker.kill();
    },
    ping(): Promise<State> {
      return new Promise((resolve, reject) => {
        worker.once('message', (message) => {
          const { type, payload } = message;
          if (type === 'ping') {
            return resolve(payload);
          }
          return reject(`unexpected message of type: ${type}`);
        });
        worker.send({ type: 'ping' });
      });
    },
    load(file: string): void {
      worker.send({ type: 'load', payload: file });
    },
    exec(fname: string, ...args: any[]): Promise<any> {
      return new Promise((resolve, reject) => {
        worker.once('message', (message) => {
          const { type, payload } = message;
          if (type === 'result') {
            return resolve(payload);
          }
          return reject();
        });
        worker.send({ type: 'exec', payload: { fname, args } });
      });
    },
  };
}

process.on('message', (message) => {
  const { type, payload } = message;
  const handler = handlers[type];
  if (handler) {
    handler(payload);
  }
});
