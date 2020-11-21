import { Item } from './types';

const toArray = <T>(top: Item<T>): T[] => {
  const xs: T[] = [];
  let curr = top.next;

  while (curr) {
    xs.push(curr.value);
    curr = curr.next;
  }

  return xs;
};

export default toArray;
