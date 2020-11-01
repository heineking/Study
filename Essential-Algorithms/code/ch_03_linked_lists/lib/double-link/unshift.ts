import { Top, Bottom } from './types';
import insert from './insert';

const unshift = <T>(value: T, top: Top<T>, bottom: Bottom<T>) => {
  insert(value, top, bottom);
};

export default unshift;
