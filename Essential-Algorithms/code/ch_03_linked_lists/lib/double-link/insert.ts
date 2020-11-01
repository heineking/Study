import { Bottom, Item, Top } from './types';

const insert = <T>(value: T, after: Item<T> | Top<T>): void => {

  const item: Item<T> = {
    value,
    next: after.next,
    prev: after,
  };

  after.next = item;
  item.next.prev = item;
};

export default insert;
