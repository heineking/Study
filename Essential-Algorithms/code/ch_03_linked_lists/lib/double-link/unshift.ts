import { Item, Top, Bottom } from './types';

const unshift = <T>(value: T, top: Top<T>, bottom: Bottom<T>) => {
  const item: Item<T> = { value, prev: null, next: null };

  if (!top.next || !bottom.prev) {
    top.next = item;
    bottom.prev= item;
    return;
  }

  top.next.prev = item;
  item.next = top.next;
  top.next = item;
};

export default unshift;
