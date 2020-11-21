import { Item } from './types';

const swap = <T>(a: Item<T>, b: Item<T>): void => {
  const prev = a.prev;
  const next = b.next;

  a.next = next;
  a.prev = b;

  b.prev = prev;
  b.next = a;

  if (prev) {
    prev.next = b;
  }

  if (next) {
    next.prev = a;
  }
};

export default swap;
