export interface Item<T> {
  next?: Item<T>;
  prev?: Item<T>;
  value: T;
}

export interface SwapList<T> {
  add(value: T | T[]): void;
  find(predicate: (value: T) => boolean): T | void;
  toArray(): T[];
}
