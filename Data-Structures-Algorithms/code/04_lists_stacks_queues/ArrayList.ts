import { List } from "./types";

interface Values<T> { [index: number]: T }
interface XS<T> { values: Values<T>; pos: number; length: number; }

const empty = <T>(): XS<T> => ({ values: [], pos: 0, length: 0 });

const range = (s: number, n: number) => Array.from({ length: n }).map((_, i) => i + s);

export const ArrayList = <T>(xs: XS<T> = empty<T>()): List<T> => ({
  at: (index: number) => ArrayList<T>({
    ...xs,
    pos: index,
  }),

  length: () => xs.length,

  clear: () => ArrayList<T>(empty<T>()),

  reset: () => ArrayList({
    ...xs,
    pos: 0,
  }),

  insert: (item: T) => {
    const values: Values<T> = {};

    for (const index of range(0, xs.length)) {
      const shiftBy = xs.pos <= index ? 1 : 0;
      const nextIndex = index + shiftBy;
      values[nextIndex] = xs.values[index];
    }

    return ArrayList<T>({
      pos: xs.pos,
      length: xs.length + 1,
      values: Object.assign(values, { [xs.pos]: item }),
    });
  },

  append: (item: T) => ArrayList<T>({
    pos: xs.pos,
    length: xs.length + 1,
    values: {
      ...xs.values,
      [xs.length]: item,
    },
  }),

  remove: () => {
    const item = xs.values[xs.pos];

    const values = range(0, xs.length).reduce((values, i) => {
      if (i === xs.pos) {
        return values;
      }
      const j = i + (i > xs.pos ? -1 : 0);
      return {
        ...values,
        [j]: xs.values[i],
      };
    }, {});

    const nextLength = xs.length - 1;

    const nextPos = xs.pos === nextLength
      ? nextLength > 0 ? xs.pos - 1 : xs.pos
      : xs.pos;

    const next = ArrayList<T>({
      pos: nextPos,
      length: nextLength,
      values,
    });

    return [item, next];
  },

  next: () => {
    if (xs.pos >= xs.length) {
      return null;
    }

    const value = xs.values[xs.pos + 1];
    const ys = ArrayList<T>({ ...xs, pos: xs.pos + 1 });

    return [value, ys];
  },

  set: (item: T) => ArrayList<T>({
    ...xs,
    values: {
      ...xs.values,
      [xs.pos]: item,
    } 
  }),

  value: () => xs.values[xs.pos],

  toArray: () => range(0, xs.length).map((i) => xs.values[i]),
});
