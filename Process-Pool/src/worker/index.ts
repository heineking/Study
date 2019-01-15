import { fork } from 'child_process';
import { State, Message } from './types';

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