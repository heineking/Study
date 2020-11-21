import { Item } from './types';

const add = <T>(top: Item<T>, value: T | T[]): void => {
  const xs = ([] as T[]).concat(value);
  xs.reverse();

  for (const x of xs) {
    const item: Item<T> = { prev: top, next: top.next, value: x };
    if (top.next) {
      top.next.prev = item;
    }
    top.next = item;
  }
};

export default add;
