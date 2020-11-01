import { Top } from './types';

const toArray = <T>(top: Top<T>): T[] => {
  const xs: T[] = [];

  let curr = top.next;
  while (curr.next) {
    xs.push(curr.value);
    curr = curr.next;
  }

  return xs;
};

export default toArray;
