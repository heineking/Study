import { List } from './types';

interface Link<T> { value: T; prev: Link<T>; next: Link<T>; }
interface XS<T> { head: Link<T>; tail: Link<T>; curr: Link<T>; length: number; }

const createLink = <T>(value: T | null, prev: Link<T> | null, next: Link<T> | null): Link<T> => ({
  value,
  prev,
  next
});

const empty = <T>(): XS<T> => {
  const head = createLink<T>(null, null, null);
  const tail = createLink<T>(null, null, null);
  const curr = head;

  head.next = tail;
  tail.prev = head;

  return { head, tail, curr, length: 0 };
};

export const LinkedList = <T>(xs: XS<T> = empty()): List<T> => ({

  at: (index: number) => {
    let node = xs.curr;

    for (let n = 0; n < index; ++n) {
      node = node.next;
    }

    return LinkedList({
      ...xs,
      curr: node,
    });
  },

  set: (item: T) => {
    xs.curr.next.value = item;
    return LinkedList<T>({...xs});
  },

  value: () => xs.curr.next.value,

  clear: () => LinkedList<T>(empty<T>()),

  reset: () => LinkedList<T>({ ...xs, curr: xs.head }),

  length: () => xs.length,

  insert: (item: T) => {
    const link = createLink(item, xs.curr.next.prev, xs.curr.next);
    xs.curr.next.prev = link;
    xs.curr.next = link;

    return LinkedList({
      ...xs,
      length: xs.length + 1,
    });
  },

  append: (item: T) => {
    const link = createLink(item, xs.tail.prev, xs.tail);

    xs.tail.prev.next = link;
    xs.tail.prev = link;

    return LinkedList({
      ...xs,
      length: xs.length + 1,
    });
  },

  remove: (): [T, List<T>] => {
    const item = xs.curr.next.value;

    xs.curr.next.next.prev = xs.curr;
    xs.curr.next = xs.curr.next.next;

    const next = LinkedList<T>({
      ...xs,
      length: xs.length - 1,
    });

    return [item, next];
  },

  next: () => {
    if (xs.curr.next === xs.tail) {
      return null;
    }

    const item = xs.curr.next.value;
    const next = LinkedList<T>({
      ...xs,
      curr: xs.curr.next.next,
    });

    return [item, next];
  },

  toArray: () => {
    const values: T[] = [];
    let node = xs.head.next;

    while (node !== xs.tail) {
      values.push(node.value);
      node = node.next;
    }

    return values;
  }
});
