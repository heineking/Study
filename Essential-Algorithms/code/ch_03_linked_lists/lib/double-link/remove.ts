import { Item, Top, Bottom } from './types';

const remove = <T>(item: Item<T>, top: Top<T>, bottom: Bottom<T>): void => {
  const next = item.next;
  const prev = item.prev;
  next.prev = prev;
  prev.next = next;
};

export default remove;
