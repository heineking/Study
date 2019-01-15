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
    return Object
      .keys($module)
      .filter((key: string) => typeof $module[key] === 'function');
  },
};

const handlers: Handlers = {
  async exec({ args }): Promise<any> {
    const [fname, ...rest] = args;

    return $module[fname]
      ? $module[fname](...rest)
      : $module.default(...args);
  },
  async load({ args }): Promise<void> {
    state.file = args[0]; 
    $module = require(state.file);
  },
  async ping(): Promise<State> {
    return state;
  },
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
