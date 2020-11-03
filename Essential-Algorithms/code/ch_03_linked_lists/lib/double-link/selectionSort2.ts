import { Item, LessThan, Bottom, Top } from './types';
import { createSentinals } from './index';
import remove from './remove';
import push from './push';

const findBottom = <T>(top: Top<T>): Bottom<T> => {
  let curr = top.next;
  while (curr.next) {
    curr = curr.next;
  }
  return curr;
};

const getNext = <T>(visited: Set<Item<T>>, curr: Item<T> | Bottom<T>): Item<T> | Bottom<T> => {
  while (curr.next && visited.has(curr)) {
    curr = curr.next;
  }
  return curr;
};

const selectionSort2 = <T>(lt: LessThan<T>) => (top: Top<T>): void => {
  const [$top, $bottom] = createSentinals<T>();
  const visited = new Set<Item<T>>();

  while(true) {
    let largest = getNext(visited, top.next);
    let curr = largest;

    // when we're at the bottom then all
    // items have been added to the sorted
    // list
    if (!curr.next || !largest.next) {
      break;
    }

    // loop the list to find the next largest
    // unvisited item
    while (curr.next && largest.next) {
      if (lt(largest.value, curr.value)) {
        largest = curr;
      }
      curr = getNext(visited, curr.next);
    }

    // mark the largest as visited
    visited.add(largest);
    push(largest.value, $bottom);
  }

  top.next = $top.next;
};

export default selectionSort2;
