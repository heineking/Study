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
  exec({ args, messageId }: any): void {
    const [fname, ...rest] = args;

    const result = $module[fname]
      ? $module[fname](...rest)
      : $module.default(...args);

    process.send({
      messageId, 
      type: 'result',
      payload: result
    });
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
  let uid = 0; 
  return {
    kill() {
      worker.kill();
    },
    ping(): Promise<State> {
      return new Promise((resolve, reject) => {
        worker.addListener('message', function handler(message) {
          const { type, payload } = message;
          if (type === 'ping') {
            worker.removeListener('message', handler);
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
    exec(...args: any[]): Promise<any> {
      const messageId = ++uid;
      return new Promise((resolve, reject) => {
        worker.addListener('message', function handler(message) {
          const { type, payload } = message;
          if (messageId !== message.messageId) {
            return;
          }
          if (type === 'result') {
            worker.removeListener('message', handler);
            return resolve(payload);
          }
        });
        worker.send({
          type: 'exec',
          payload: {
            messageId,
            args,
          },
        });
      });
    },
  };
}

process.on('message', (message) => {
  const { type, payload } = message;
  const handler = handlers[type];
  if (handler) {
    handler(payload);
  } else {
    process.send({
      type: 'error',
      payload: `[${type}] does not map to a valid handler.`,
    });
  }
});
