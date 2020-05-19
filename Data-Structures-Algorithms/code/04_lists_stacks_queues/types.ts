export interface List<T> {
  readonly count: number;
  at(index: number): List<T>;
  clear(): void;
  get(index: number): T;
  insert(item: T): List<T>;
  pop(): T | undefined;
  push(item: T): void; 
  remove(): List<T>;
  set(index: number, value: T): List<T>;
  toArray(): T[];
  toString(): string;
}

export interface Stack<T> {
  readonly count: number;
  clear(): void;
  push(item: T): void;
  pop(): T;
  peek(): T;
  toArray(): T[];
}

export interface Queue<T> {
  readonly count: number;
  clear(): void;
  enqueue(item: T): void;
  dequeue(): T;
  peek(): T;
  toArray(): T[];
}

export interface Dictionary<K, T> {
  readonly size: number;
  insert(key: K, item: T): void;
  find(key: K): T;
  remove(key: K): T;
  removeAny(): T;
  toArray(): Array<[K, T]>;
}

export interface KeyValuePair<K, T> {
  readonly key: K;
  readonly value: T;
}

export interface KeyCompare<T> {
  lt(x: T, y: T): boolean;
  eq(x: T, y: T): boolean;
  gt(x: T, y: T): boolean;
}
