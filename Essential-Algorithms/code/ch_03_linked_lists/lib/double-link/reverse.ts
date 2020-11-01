import { Top, Bottom } from './types';

/*

    +-----+       +-----+       +-----+
    |     | --->  |     | --->  |     |
    |     | <---  |     | <---  |     |
    +-----+       +-----+       +-----+

*/

const reverse = <T>(top: Top<T>, bottom: Bottom<T>): void => {
  // handle empty list
  if (!top.next || !bottom.prev) {
    return;
  }

  // handle list of length 1
  if (top.next === bottom.prev) {
    return;
  }

  // otherwise reverse the contents
  let y = bottom.prev;
  let x = bottom.prev.prev;

  while (x) {
    // save our next node before we flip the nodes
    const next = x.prev;

    // flip the nodes
    x.prev = y;
    y.next = x;

    // update the items
    y = x;
    x = next;
  }

  // lastly, update start and end
  const start = bottom.prev;
  const end = top.next;
  start.prev = null;
  end.next = null;

  // flip the sentinals
  bottom.prev = end;
  top.next = start;
};

export default reverse;
