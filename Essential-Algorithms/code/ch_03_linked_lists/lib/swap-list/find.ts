import { Item } from './types';
import swap from './swap';

const find = <T>(top: Item<T>, predicate: (value: T) => boolean): T | void => {
  let match = top.next;

  while (match && !predicate(match.value)) {
    match = match.next;
  }

  if (!match) {
    return;
  }

  // swap
  const prev = match.prev;

  if (prev && prev !== top) {
    swap(prev, match);
  }

  return match.value;
};

export default find;
