import { Top, Bottom, Item } from './types';

const reverse = <T>(top: Top<T>, bottom: Bottom<T>): void => {
  // handle empty list
  if (top.next === bottom && bottom.prev === top) {
    return;
  }

  // handle list of length 1
  if (top.next === bottom.prev) {
    return;
  }

  // flip the nodes
  let z = bottom.prev;
  let y = bottom.prev.prev;

  while (y && y.prev) {
    const x = y.prev;

    y.prev = z;
    z.next = y;

    z = y;
    y = x;
  }

  // flip the sentinals
  const end = top.next as Item<T>;
  const start = bottom.prev as Item<T>;

  start.prev = top;
  top.next = start;

  end.next = bottom;
  bottom.prev = end;
};

export default reverse;
