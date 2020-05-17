import { List, Queue } from './types';
import ArrayList from './ArrayList';

export default class ArrayQueue<T> implements Queue<T> {
  public static Of<R>(size: number): ArrayQueue<R> {
    return new ArrayQueue<R>(size);
  }

  private maxSize: number;
  private front: number;
  private rear: number;

  private xs: List<T>;

  private constructor(size: number) {
    this.maxSize = size + 1;
    this.rear = 0;
    this.front = 1;
    this.xs = ArrayList.Of<T>(Array(this.maxSize));
  }

  get count(): number {
    return ((this.rear + this.maxSize) - this.front + 1) % this.maxSize;
  }

  clear(): void {
    this.rear = 0;
    this.front = 1;
    this.xs = ArrayList.Of<T>();
  }

  enqueue(item: T): void {
    if ((this.rear + 2) % this.maxSize === this.front) {
      throw new RangeError(`Queue is full`);
    }

    this.rear = (this.rear + 1) % this.maxSize;
    this.xs.at(this.rear).insert(item);
  }

  dequeue(): T {
    if (this.count === 0) {
      throw new RangeError('Queue is empty');
    }
    const item = this.xs.get(this.front);
    this.front = (this.front + 1) % this.maxSize;
    return item;
  }

  peek(): T {
    if (this.count === 0) {
      throw new RangeError('Queue is empty');
    }
    return this.xs.get(this.front);
  }

  toArray(): T[] {
    let ys: T[] = [];
    for (let i = this.front; i <= this.rear; ++i) {
      ys.push(this.xs.get(i));
    }
    return ys;
  }
}