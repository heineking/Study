import { Item, Sentinal } from './types';

/*

    +-----+       +-----+       +-----+
    |     | --->  |     | --->  |     |
    |     | <---  |     | <---  |     |
    +-----+       +-----+       +-----+

*/

const reverse = <T>(top: Sentinal<T>, bottom: Sentinal<T>): void => {
  // handle empty list
  if (!top.item || !bottom.item) {
    return;
  }

  // handle list of length 1
  if (top.item === bottom.item) {
    return;
  }

  // otherwise reverse the contents
  let y = bottom.item;
  let x = bottom.item.prev;

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
  const start = bottom.item;
  const end = top.item;
  start.prev = null;
  end.next = null;

  // flip the sentinals
  bottom.item = end;
  top.item = start;
};

export default reverse;
