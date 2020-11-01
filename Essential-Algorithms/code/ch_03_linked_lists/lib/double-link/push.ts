import { Item, Top, Bottom } from './types';

const push = <T>(value: T, top: Top<T>, bottom: Bottom<T>): void => {
  const item: Item<T> = { value, next: null, prev: null };

  if (!top.next|| !bottom.prev) {
    top.next = item;
    bottom.prev = item;
    return
  }

  bottom.prev.next = item;
  item.prev = bottom.prev;
  bottom.prev = item;
};

export default push;
