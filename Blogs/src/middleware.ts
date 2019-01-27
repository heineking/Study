interface Store {
  getState: () => any,
  register(step: any): (() => void),
};

const state: any = {
  steps: [],
};

const store: Store = {
  getState() {
    return state;
  },
  register(step: any) {
    state.steps.push(step);
    return () => {
      state.steps.splice(state.steps.indexOf(step), 1);
    };
  }
};

const noop = () => {};

// implementation of middleware inspired by express and redux
{

/* Simple / Manual */

const first: any = (store: Store) => (next: () => void = noop) => {
  console.log('first');
  console.log(store.getState());
  return next();
};

const second: any = (store: Store) => (next: () => void = noop) => {
  console.log('second');
  console.log(store.getState());
  return next();
};

first(store)(second(store));

}

/* advance chain of responsibility */
{
  class Step {
    private name: string;
    public valid: boolean = false;

    constructor(name: string) {
      this.name = name;
    }

    handle: any = (store: Store) => (next: any = noop) => (action: any) => {
      console.log(store.getState());
      if (action.type === 'activate' && this.valid) {
        return next(action);
      }
      console.log(`${this.name} is handling ${action.type}`);
    }
  }
  
  const step1 = new Step('step1');
  const step2 = new Step('step2');

  function injectStore(...steps: Step[]) {
    steps.forEach((step) => step.handle = step.handle(store));
  }

  injectStore(step1, step2); 


  const run = (action: any, ...steps: Step[]) => {
    const [head, ...rest] = steps;
    return head.handle((action: any) => {
      if (rest.length > 0) {
        return run(action, ...rest);
      }
    })(action);
  };

  run({ type: 'activate' }, step1, step2);
  state.xs.splice(1, 1);
  step1.valid = true;
  run({ type: 'activate' }, step1, step2);
}
