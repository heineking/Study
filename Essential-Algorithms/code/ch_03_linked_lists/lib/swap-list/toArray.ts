import { Item } from './types';

const toArray = <T>(item: Item<T>): T[] => {
  const xs: T[] = [];
  let curr = item.next;

  while (curr && curr.value !== undefined) {
    xs.push(curr.value);
    curr = curr.next;
  }

  return xs;
};

export default toArray;
