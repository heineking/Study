import { Sentinal } from './types';

const pop = <T>(top: Sentinal<T>) => {
  if (!top.next) {
    return;
  }

  // get the second-to-last item in array
  let curr = top.next;
  let value = curr.value;

  if (curr.next === null) {
    top.next = null;
    return value;
  }

  while (curr.next && curr.next.next !== null) {
    value = curr.next.next.value;
    curr = curr.next;
  }

  curr.next = null;

  return value;
};

export default pop;
