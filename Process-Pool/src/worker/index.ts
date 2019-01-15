import { fork, ChildProcess } from 'child_process';
import { Message, Handlers } from './types';

const bindHandlers = (worker: ChildProcess) => {
  const handlers: Array<keyof Handlers> = [
    'exec',
    'load',
    'ping',
    'exit',
  ];
  const proxy = Object.create(null);
  for(const handler of handlers) {
    proxy[handler] = function handle(...args: any[]) {
      const id = ++proxy[handler].uid;
      return new Promise((resolve, reject) => {
        // set up the receiver
        worker.addListener('message', function messageHandler(message: Message) {
          const { type, status, payload, messageId } = message;
          if (type !== handler || id !== messageId) {
            return;
          }
          worker.removeListener('message', messageHandler);
          if (status === 'error') {
            return reject(payload);
          }
          return resolve(payload);
        });
        // invoke
        worker.send({
          messageId: id,
          type: handler,
          payload: { args },
        });
      });
    };
    proxy[handler].uid = 0;
  }
  return proxy;
};

export function createWorker() {
  const workerFile = require.resolve('./worker.ts');
  const tsnode = require.resolve('../../node_modules/ts-node/dist/bin.js');
  const worker = fork(workerFile, [], { execArgv: [tsnode] });
  return bindHandlers(worker);
}
