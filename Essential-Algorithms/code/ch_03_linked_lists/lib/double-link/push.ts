import { Item, Top, Bottom } from './types';
import insert from './insert';

const push = <T>(value: T, top: Top<T>, bottom: Bottom<T>): void => {
  insert(value, top, bottom, bottom.prev || undefined);
};

export default push;
