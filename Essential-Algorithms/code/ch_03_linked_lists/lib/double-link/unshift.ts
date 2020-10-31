import { Item, Sentinal } from './types';

const unshift = <T>(value: T, top: Sentinal<T>) => {
  const item: Item<T> = { value, prev: null, next: null };

  if (!top.item) {
    top.item = item;
    return;
  }

  top.item.prev = item;
  item.next = top.item;
  top.item = item;
};

export default unshift;
