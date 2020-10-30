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

/*
  The algorithm doesn't change popping items from the array. Removal
  still requires a list traversal but needs changed to update the
  cell that the bottom pointer points to.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import { Sentinal, List } from './lib/single-link/types';
import createList from './lib/single-link/createList';
import toArray from './lib/single-link/toArray';

const createList2 = <T>(): List<T> => {

  const push = (value: T, top: Sentinal<T>, bottom: Sentinal<T>) => {
    if (bottom.next === null || top.next === null) {
      top.next = { next: null, value };
      bottom.next = top.next;
      return;
    }

    const last = bottom.next;
    last.next = { next: null, value };
    bottom.next = last.next;
  };

  const pop = (top: Sentinal<T>, bottom: Sentinal<T>): T | void => {
    if (!top.next || !bottom.next) {
      return;
    }

    const value = bottom.next.value;

    let curr = top.next;

    // handle list with length 1
    if (curr.next === null) {
      top.next = null;
      bottom.next = top.next;
      return value;
    }

    while (curr.next && curr.next.next !== null) {
      curr = curr.next;
    }

    curr.next = null;
    bottom.next = curr;

    return value;
  };

  return (() => {
    const top: Sentinal<T> = { next: null };
    const bottom: Sentinal<T> = { next: null };

    return {
      pop: () => pop(top, bottom),
      push: (value: T) => push(value, top, bottom),
      reduce: (fn: any) => { throw new Error('not implemented'); },
      toArray: () => toArray(top),
    };

  })();
};

describe(basename, () => {

  const lists = {
    'List (w/ top sentinal only)': createList,
    'List (w/ bottom sentinal)': createList2,
  };

  Object.entries(lists).forEach(([name, create]) => {

    describe(name, () => {

      it('should push items to end of array', () => {
        const list = create<number>();
        const xs = [0, 1, 2, 3, 4];

        xs.forEach((x) => list.push(x));
        expect(list.toArray()).to.eql(xs);
      });

      it('should pop items from the end of the array', () => {
        const list = create<number>();
        const xs = [0, 1, 2, 3];

        xs.forEach((x) => list.push(x));

        const y = list.pop();

        expect(y).to.equal(3);
        expect(list.toArray()).to.eql(xs.slice(0, -1));
      });

      it('should empty list when item is popped from list with one item', () => {
        const list = create<number>();
        list.push(0);
        list.pop();
        expect(list.toArray()).to.eql([]);
      });

    });

  });
});
