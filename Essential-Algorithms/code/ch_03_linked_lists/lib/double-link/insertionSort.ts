import { Item, Top, LessThan } from './types';
import { createSentinals } from './index';
import insert from './insert';

const insertionSort = <T>(lt: LessThan<T>) => (top: Top<T>): void => {
  // handle empty lists
  if (!top.next.next) {
    return;
  }

  const [$top, $bottom] = createSentinals<T>();

  let curr = top.next;

  // loop the unsorted list
  while (curr.next) {
    const next = curr;
    curr = curr.next as Item<T>;

    // loop the sorted list to find where to insert
    let before = $top.next;
    while (before.next && lt(next.value, before.value)) {
      before = before.next as Item<T>;
    }

    // add the item to the sorted list
    insert(next.value, before.prev);
  }

  // point the top of unsorted list to the sorted list
  top.next = $top.next;
};

export default insertionSort;
