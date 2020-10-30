import { Sentinal } from './types';

const push = <T>(value: T, top: Sentinal<T>) => {
  let last = top;

  while (last.next !== null) {
    last = last.next;
  }

  last.next = { value, next: null };
};

export default push;
