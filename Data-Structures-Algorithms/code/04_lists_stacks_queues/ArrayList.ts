import { List } from './types';
import { arrayToObject } from './utils';

export default class ArrayList<T> implements List<T> {
  public static Of<R>(xs: R[] = []): List<R> {
    return new ArrayList(xs);
  }

  private xs: { [index: number]: T };
  private length: number;
  private pos: number; 

  private constructor(xs: T[]) {
    this.xs = arrayToObject(xs);
    this.pos = 0;
    this.length = xs.length;
  }

  get count(): number {
    return this.length;
  }

  public at(index: number): List<T> {
    if (index < 0 || index >= this.length) {
      throw new RangeError('index out of bounds');
    }

    this.pos = index;
    return this;
  }

  public get(index: number = this.pos): T {
    this.at(index);
    return this.xs[this.pos];
  }

  public set(index: number, value: T): List<T> {
    this.at(index);
    this.xs[this.pos] = value;
    return this;
  }

  public clear(): void {
    Object.assign(this, {
      xs: Object.create(null),
      length: 0,
      pos: 0,
    });
  }

  public push(item: T): void {
    this.xs[this.length] = item;
    this.length += 1;
  }

  public pop(): T | undefined {
    if (this.length === 0) {
      return;
    }

    const originalPos = this.pos;
    const index = this.length - 1;
    const value = this.xs[index];

    this.at(index).remove();
    this.at(originalPos);

    return value;
  }

  public insert(item: T): List<T> {
    for (let i = this.length; i > this.pos; i -= 1) {
      this.xs[i] = this.xs[i - 1];
    }
    this.xs[this.pos] = item;
    this.length += 1;

    return this;
  }

  public remove(): List<T> {
    if (this.count === 0) {
      return this;
    }

    for (let i = this.pos; i < this.length - 1; ++i) {
      this.xs[i] = this.xs[i + 1];
    }

    delete this.xs[this.length];
    this.length -= 1;

    return this;
  }

  public toArray(): T[] {
    const ys: T[] = [];
    for (let i = 0; i < this.length; ++i) {
      ys[i] = this.xs[i];
    }
    return ys;
  }

  public toString(): string {
    return JSON.stringify({
      xs: this.xs,
      length: this.length,
      pos: this.pos,
    }, null, 2);
  }
}
