export interface Item<T> {
  value: T;
  next: Item<T> | null;
}

export interface Sentinal<T> {
  next: Item<T> | null;
}

export type Reducer<T> = (acc: T, curr: T) => T;

export interface List<T> {
  push(value: T): void;
  pop(): T | void;
  reduce(reducer: Reducer<T>): T | void;
  toArray(): T[];
}