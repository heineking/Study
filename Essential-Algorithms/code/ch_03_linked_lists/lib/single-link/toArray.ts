import { Sentinal } from './types';

const toArray = <T>(top: Sentinal<T>) => {
  const xs: T[] = [];

  if (top === null) {
    return xs;
  }

  let curr = top;
  while (curr.next !== null) {
    xs.push(curr.next.value);
    curr = curr.next;
  }

  return xs;
};

export default toArray;
