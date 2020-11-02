export interface List<T> {
  at(index: number): Item<T>;
  insert(value: T, after?: Item<T>): void;
  push(value: T): void;
  remove(item: Item<T>): void;
  reverse(): List<T>;
  sort(sort: Sorter<T>): void;
  toArray(): T[];
  unshift(value: T): void;
}

export type LessThan<T> = (a: T, b: T) => boolean;

export interface Item<T> {
  value: T;
  next: Item<T> | Bottom<T>;
  prev: Item<T> | Top<T>;
}

export interface Top<T> {
  next: Item<T> | Bottom<T>;
  prev: null;
}

export interface Bottom<T> {
  prev: Item<T> | Top<T>;
  next: null;
}

export type Sorter<T> = (top: Top<T>) => void;
