export interface List<T> {
  push(value: T): void;
  reverse(): List<T>;
  unshift(value: T): void;
  toArray(): T[];
}

export interface Item<T> {
  value: T;
  next: Item<T> | null;
  prev: Item<T> | null;
}

export interface Top<T> {
  next: Item<T> | null;
}

export interface Bottom<T> {
  prev: Item<T> | null;
}
