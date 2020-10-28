/*
  The section “Adding Cells at the End” gives an O(N) algorithm for
  adding an item at the end of a singly linked list. If you keep
  another variable, bottom, that points to the last cell in the
  list, then you can add items to the end of the list in O(1) time.
  Write such an algorithm. How does this complicate other
  algorithms that add an item at the beginning or end of the
  list, find an item, and remove an item? Write an algorithm for
  removing an item from this kind of list.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

interface Sentinal<T> {
  next: Cell<T> | null;
}

interface Cell<T> {
  value: T;
  next: Cell<T> | null;
}

interface Push<T> {
  ops: number;
  (value: T): void;
}

interface List<T> {
  push: Push<T>;
  toArray(): T[];
}


const createSingleLinkedList1 = <T>(): List<T> => {
  const top: Sentinal<T> = { next: null };

  function toArray(): T[] {
    const xs: T[] = [];

    if (top.next === null) {
      return xs;
    }

    let curr = top.next;

    xs.push(curr.value);

    while (curr.next !== null) {
      xs.push(curr.next.value);
      curr = curr.next;
    }

    return xs;
  }

  function push(value: T) {
    let ops = 0;

    if (top.next === null) {
      top.next = { value, next: null };
      return;
    }

    let curr = top.next;

    // find last cell
    while (curr.next !== null) {
      ops += 1;
      curr = curr.next;
    }

    // add to the end
    curr.next = { value, next: null };
    (push as Push<T>).ops = ops;
  };

  return {
    push: push as Push<T>,
    toArray,
  };
};

describe(basename, () => {

  describe('createSingleLinkedList1', () => {

    const list = createSingleLinkedList1<number>();

    it('should push items to end of array', () => {

      const xs = [0, 1, 2, 3, 4];
      xs.forEach((x) => list.push(x));
      expect(list.toArray()).to.eql(xs);

    });
  });

});
