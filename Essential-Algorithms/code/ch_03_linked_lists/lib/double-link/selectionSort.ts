import { Item, LessThan, Top } from './types';
import { createSentinals } from './index';
import remove from './remove';
import push from './push';

const selectionSort = <T>(lt: LessThan<T>) => (top: Top<T>): void => {
  const [$top, $bottom] = createSentinals<T>();

  while (top.next.next) {
    let largest = top.next;
    let curr = top.next;

    // loop the unsorted list to get the largest item
    while (curr.next) {
      if (lt(largest.value, curr.value)) {
        largest = curr;
      }

      curr = curr.next as Item<T>;
    }

    // remove the largest item from the unsorted list
    remove(largest);

    // add the item to the end of the sorted list
    push(largest.value, $bottom);
  }

  // point the top of the original list to the newly sorted list
  top.next = $top.next;
};

export default selectionSort;
