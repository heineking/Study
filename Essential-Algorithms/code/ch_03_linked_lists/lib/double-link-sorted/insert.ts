import { Item, LessThan, Bottom, Top } from './types';

const insertBefore = <T>(value: T,  after: Item<T> | Bottom<T>): void => {
  const item = {
    value,
    next: after,
    prev: after.prev,
  };

  after.prev = item;
  item.prev.next = item;
};

const insert = <T>(value: T, top: Top<T>, lt: LessThan<T>): void => {
  let curr = top.next;

  while(curr && curr.next && lt(curr.value, value)) {
    curr = curr.next;
  }

  insertBefore(value, curr);
};

export default insert;
