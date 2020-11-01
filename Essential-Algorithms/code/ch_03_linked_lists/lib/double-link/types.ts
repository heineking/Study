export interface List<T> {
  at(index: number): Item<T>;
  insert(value: T, after?: Item<T>): void;
  push(value: T): void;
  remove(item: Item<T>): void;
  reverse(): List<T>;
  unshift(value: T): void;
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
  prev: Item<T> | Top<T>;
  next: null;
}
