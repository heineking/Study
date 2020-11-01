import { Top, Bottom } from './types';
import insert from './insert';

const unshift = <T>(value: T, top: Top<T>) => {
  insert(value, top);
};

export default unshift;
