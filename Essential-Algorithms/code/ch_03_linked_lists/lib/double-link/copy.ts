import { List, Top } from './types';
import { createList } from './index';

const copy = <T>(top: Top<T>): List<T> => {
  const list = createList<T>();
  let curr = top.next;
  while (curr.next) {
    list.push(curr.value);
    curr = curr.next;
  }
  return list;
};

export default copy;
