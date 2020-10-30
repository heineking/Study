import { Sentinal, Reducer } from './types';

const reduce = <T>(reducer: Reducer<T>, top: Sentinal<T>): T | void => {
  if (top.next === null) {
    return;
  }

  let curr = top.next;
  let acc = curr.value;

  while (curr.next) {
    acc = reducer(acc, curr.next.value);
    curr = curr.next;
  }

  return acc;
};

export default reduce;
