import { Item, Top } from './types';

const at = <T>(index: number, top: Top<T>): Item<T> => {
  if (index < 0 || !top.next) {
    throw new RangeError();
  }

  let target = top.next;

  while (index > 0) {

    if (!target.next) {
      throw new RangeError();
    }

    target = target.next;
    index -= 1;
  }

  return target;
};

export default at;
