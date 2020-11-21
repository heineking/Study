import { Item } from './types';

const itemAt = <T>(top: Item<T>, index: number): Item<T> => {
  let curr = top.next;
  while (curr && index > 0) {
    curr = curr.next;
    index -= 1;
  }

  if (!curr || index > 0) {
    throw new RangeError();
  }

  return curr;
};

export default itemAt;
