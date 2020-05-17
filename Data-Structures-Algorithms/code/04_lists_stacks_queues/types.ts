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