import { Item, Top, Bottom } from './types';
import insert from './insert';

const push = <T>(value: T, top: Top<T>, bottom: Bottom<T>): void => {
  insert(value, bottom.prev || top, bottom);
};

export default push;
