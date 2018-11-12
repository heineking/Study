export const curry = (f: (...args: any[]) => any, arity: number = f.length, received: any[] = []): any  => {
  return (...args: any[]) => {
    const combined = [...received, ...args];
    const remaining = arity - combined.length;
    return remaining > 0
      ? curry(f, remaining, combined)
      : f.apply(null, combined);
  };
};

export const range = (s: number, e: number): number[] => {
  return Array.from({ length: (e - s + 1) }, (_, k) => k + s);
};

export const repeatedly = <T>(times: number, f: () => T): T[] => {
  const xs: T[] = new Array(times);
  for (let i = 0; i < times; ++i) {
    xs.push(f());
  }
  return xs;
};

export const doWhen = curry((f: () => any, predicate: boolean): any => {
  if (predicate) {
    return f();
  }
});

export const dispatch = (...fs: Array<(...args: any[]) => any>) => {
  return (...args: any[]) => {
    for (const f of fs) {
      const result = f.apply(null, args);
      if (result !== undefined) {
        return result;
      }
    }
  };
};

export function compose<A, B>(f: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C;
export function compose(...args: any[]) {
  switch (args.length) {
    case 1: return compose1(args[0]);
    case 2: return compose2(args[0], args[1]);
  }
}

function compose1<A, B>(f: (a: A) => B): (a: A) => B {
  return (a: A): B => f(a);
}

function compose2<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
  return (a: A): C => g(f(a));
}
