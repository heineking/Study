import { Sentinal } from './types';

const toArray = <T>(top: Sentinal<T>): T[] => {
  const xs: T[] = [];

  let curr = top.item;
  while (curr) {
    xs.push(curr.value);
    curr = curr.next;
  }

  return xs;
};

export default toArray;
