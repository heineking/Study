export type LessThan<T> = (a: T, b: T) => boolean;

export interface List<T> {
  insert(value: T): void;
  toArray(): T[];
}

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
  next: null;
  prev: Item<T> | Top<T>;
}
