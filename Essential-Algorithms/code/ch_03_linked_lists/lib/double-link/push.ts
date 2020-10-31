import { Item, Sentinal } from './types';

const push = <T>(value: T, top: Sentinal<T>, bottom: Sentinal<T>): void => {
  const item: Item<T> = { value, next: null, prev: null };

  if (!top.item || !bottom.item) {
    top.item = item;
    bottom.item = item;
    return
  }

  bottom.item.next = item;
  item.prev = bottom.item;
  bottom.item = item;
};

export default push;
