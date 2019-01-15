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
