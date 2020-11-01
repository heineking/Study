import { Item, Top, Bottom } from './types';
import insert from './insert';

const push = <T>(value: T, bottom: Bottom<T>): void => {
  insert(value, bottom.prev);
};

export default push;
