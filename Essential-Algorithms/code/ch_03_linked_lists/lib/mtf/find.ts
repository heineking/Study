import { Item } from './types';

const remove = <T>(item: Item<T>): void => {
  const prev = item.prev;
  const next = item.next;

  // remove item from middle of the list
  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }
};

const mtf = <T>(top: Item<T>, item: Item<T>): void => {
  item.next = top.next;
  item.prev = top;

  if (top.next) {
    top.next.prev = item;
  }

  top.next = item;
};

const find = <T>(top: Item<T>, predicate: (value: T) => boolean): T | void => {
  let match = top.next;

  while (match && !predicate(match.value)) {
    match = match.next;
  }

  if (!match) {
    return;
  }

  // mtf
  remove(match);
  mtf(top, match);

  return match.value;
};

export default find;
