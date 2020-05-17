import { List } from './types';
import { timingSafeEqual } from 'crypto';

class Link<T> {
  public static Of<R>(value: R | null = null, prev: Link<R> | null = null, next: Link<R> | null = null): Link<R> {
    return new Link<R>(value, prev, next);
  }

  public value: T;
  public prev: Link<T>;
  public next: Link<T>;

  private constructor(value: T | null, prev: Link<T> | null, next: Link<T> | null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

export default class LinkedList<T> implements List<T> {
  public static Of<R>(xs: R[] = []): List<R> {
    return new LinkedList(xs);
  }

  private readonly head: Link<T> = Link.Of();
  private readonly tail: Link<T> = Link.Of();
  private curr: Link<T> = this.head;
  private length: number = 0;

  private constructor(xs: T[]) {
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.curr = this.head;

    xs.forEach((x) => this.push(x));
  }

  private get value(): T {
    if (this.curr.next != this.tail) {
      return this.curr.next.value;
    }
  }

  get count(): number {
    return this.length;
  }

  at(index: number): List<T> {
    if (index < 0 || index >= this.length) {
      throw new RangeError('index out of bounds');
    }
    this.moveToStart();
    for (let i = 0; i < index; ++i) {
      this.next();
    }
    return this;
  }

  clear(): void {
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.curr = this.head;
    this.length = 0;
  }

  get(index: number): T {
    this.at(index);
    return this.value;
  }

  insert(item: T): List<T> {
    const link = Link.Of(item, this.curr, this.curr.next);
    this.curr.next = link;
    this.length += 1;
    return this;
  }

  pop(): T | undefined {
    if (this.length === 0) {
      return;
    }
    const item = this.tail.prev;
    this.tail.prev = item.prev;
    item.prev.next = this.tail; 
    this.length -= 1;
    return item.value;
  }

  push(item: T): void {
    const link = Link.Of(item, this.tail.prev, this.tail);
    this.tail.prev.next = link;
    this.tail.prev = link;
    this.length += 1;
  }

  remove(): List<T> {
    if (this.curr.next !== this.tail) {
      this.curr.next = this.curr.next.next;
      this.length -= 1;
    }
    return this;
  }

  set(index: number, value: T): List<T> {
    this.at(index);
    this.curr.next.value = value;
    return this;
  }

  toArray(): T[] {
    const xs: T[] = [];
    this.moveToStart();
    while (this.curr.next !== this.tail) {
      xs.push(this.value);
      this.next();
    }
    return xs;
  }

  toString(): string {
    let xs: string = '';
    let link = this.head;

    while (link !== this.tail) {
      xs += `${xs ? ', ' : ''}${link.value}`;
      link = link.next;
    }

    xs += `${xs ? ', ' : ''}${link.value}`;

    return JSON.stringify({
      xs,
      length: this.length,
      curr: this.curr.value,
    }, null, 2);
  }

  private next(): void {
    if (this.curr !== this.tail) {
      this.curr = this.curr.next;
    }
  }

  private moveToStart(): LinkedList<T> {
    this.curr = this.head;
    return this;
  }
}