import { Item, Top, Bottom } from './types';

const remove = <T>(item: Item<T>, top: Top<T>, bottom: Bottom<T>): void => {
  const next = item.next;
  const prev = item.prev;

  // update the links if there are neighbor cells
  if (!next && !prev) {
    top.next = bottom.prev = null;
  }
  else if (next && prev) {
    next.prev = prev;
    prev.next = next;
  }
  else if (prev && !next) {
    bottom.prev = prev;
    prev.next = null;
  }
  else if (next && !prev) {
    top.next = next;
    next.prev = null;
  }
};

export default remove;
