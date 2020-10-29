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

interface Item<T> {
  value: T;
  next: Item<T> | null;
}

interface Sentinal<T> {
  next: Item<T> | null;
}

const list1 = (() => {

  const push = <T>(value: T, top: Sentinal<T>) => {
    if (top === null) {
      top = { next: null };
    }

    let last = top;

    while (last.next !== null) {
      last = last.next;
    }

    last.next = { value, next: null };
  };

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

  return {
    push,
    pop,
  };
})();

const list2 = (() => {

  const push = <T>(value: T, top: Sentinal<T>, bottom: Sentinal<T>) => {
    if (bottom.next === null || top.next === null) {
      top.next = { next: null, value };
      bottom.next = top.next;
      return;
    }

    const last = bottom.next;
    last.next = { next: null, value };
    bottom.next = last.next;
  };

  const pop = <T>(top: Sentinal<T>, bottom: Sentinal<T>): T | void => {
    if (!top.next) {
      return;
    }

    let curr = top.next;

    if (top.next === bottom.next) {
      top.next = null;
      bottom.next = null;
      return curr.value;
    }

    while (curr.next && curr.next.next !== bottom.next) {
      curr = curr.next;
    }

    curr.next = null;
    bottom.next = curr;

    return curr.value;
  };

  return {
    pop,
    push,
  }
})();

const toArray = <T>(top: Sentinal<T>) => {
  const xs: T[] = [];

  if (top === null) {
    return xs;
  }

  let curr = top;
  while (curr.next !== null) {
    xs.push(curr.next.value);
    curr = curr.next;
  }

  return xs;
};

describe(basename, () => {

  describe('list1', () => {

    it('should push items to end of array', () => {
      const top = { next: null };
      const xs = [0, 1, 2, 3, 4];

      xs.forEach((x) => list1.push(x, top));
      expect(toArray(top)).to.eql(xs);
    });

    it('should pop items from the end of the array', () => {
      const top = { next: null };
      const xs = [0, 1, 2, 3];
      xs.forEach((x) => list1.push(x, top));

      const y = list1.pop(top);

      expect(y).to.equal(3);
      expect(toArray(top)).to.eql(xs.slice(0, -1));
    });

    it('should empty list when item is popped from list with one item', () => {
      const top = { next: null };
      list1.push(0, top);
      list1.pop(top);
      expect(toArray(top)).to.eql([]);
    });

  });

  describe('list2', () => {

    it('should push items to end of array', () => {
      const top = { next: null };
      const bottom = { next: null };
      const xs = [0, 1, 2, 3, 4];

      xs.forEach((x) => list2.push(x, top, bottom));
      expect(toArray(top)).to.eql(xs);
    });

    it('should pop items from the end of the array', () => {
      const top = { next: null };
      const bottom = { next: null };

      const xs = [0, 1, 2, 3];
      xs.forEach((x) => list2.push(x, top, bottom));

      const y = list1.pop(top);

      expect(y).to.equal(3);
      expect(toArray(top)).to.eql(xs.slice(0, -1));
    });

    it('should empty list when item is popped from list with one item', () => {
      const top = { next: null };
      const bottom = { next: null };

      list2.push(0, top, bottom);
      list1.pop(top);

      expect(toArray(top)).to.eql([]);
    });

  });
});
