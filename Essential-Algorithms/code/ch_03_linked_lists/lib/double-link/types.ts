export interface List<T> {
  unshift(value: T): void;
  toArray(): T[];
}

export interface Item<T> {
  value: T;
  next: Item<T> | null;
  prev: Item<T> | null;
}

export interface Sentinal<T> {
  item: Item<T> | null;
}
