import { Item, Bottom, Top } from './types';

const insert = <T>(value: T, top: Top<T>, bottom: Bottom<T>, after?: Item<T>): void => {
  const item: Item<T> = { value, next: null, prev: null };

  // handle empty list
  if (!top.next || !bottom.prev) {
    top.next = bottom.prev = item;
    return;
  }

  if (after) {
    item.next = after.next;
    after.next = item;
  } else {
    item.next = top.next;
    top.next = item;
  }

  // handle case where we inserted at the
  // end of the list
  if (item.next) {
    item.next.prev = item;
  }

  item.prev = after || null;
};

export default insert;
