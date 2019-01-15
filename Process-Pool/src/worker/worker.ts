import { fork } from 'child_process';
import { State, Handlers, Message } from './types';

let $module: any = null;

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

const handlers: Handlers = {
  async exec({ args }): Promise<any> {
    const [fname, ...rest] = args;

    return $module[fname]
      ? $module[fname](...rest)
      : $module.default(...args);
  },
  async load(file: string): Promise<void> {
    state.file = file;
    $module = require(file);
  },
  async ping(): Promise<State> {
    return state;
  }
};

export function createWorker() {
  const workerFile = require.resolve('./worker.ts');
  const tsnode = require.resolve('../../node_modules/ts-node/dist/bin.js');
  const worker = fork(workerFile, [], { execArgv: [tsnode] });
  let uid = 0; 
  return {
    kill() {
      worker.kill();
    },
    ping(): Promise<State> {
      return new Promise((resolve) => {
        worker.addListener('message', function handler(message) {
          const { type, payload } = message;
          if (type === 'ping') {
            worker.removeListener('message', handler);
            return resolve(payload);
          }
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
        worker.addListener('message', function handler(message: Message) {
          const { status, type, payload } = message;
          if (type !== 'exec' || messageId !== message.messageId) {
            return;
          }
          worker.removeListener('message', handler);
          if (status === 'ok') {
            return resolve(payload);
          }
          return reject(payload);
        });
        worker.send({
          messageId,
          type: 'exec',
          payload: {
            args,
          },
        });
      });
    },
  };
}

process.on('message', async (message: Message) => {
  const { type, payload } = message;
  const handler = handlers[type];
  try {
    const result = await handler(payload);
    process.send({
      ...message,
      status: 'ok',
      payload: result,
    });
  } catch (err) {
    process.send({
      ...message,
      status: 'error',
      payload: err.toString(),
    });
  }
});
