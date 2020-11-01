import { Item } from './types';

const remove = <T>(item: Item<T>): void => {
  const next = item.next;
  const prev = item.prev;
  next.prev = prev;
  prev.next = next;
};

export default remove;
