import { Item, Top } from './types';

const at = <T>(index: number, top: Top<T>): Item<T> => {
  if (index < 0 || top.next.next === null) {
    throw new RangeError();
  }

  let target = top.next;
  index -= 1;

  while (index >= 0 && target.next.next) {
    target = target.next;
    index -= 1;
  }

  if (index >= 0) {
    throw new RangeError();
  }

  return target;
};

export default at;
