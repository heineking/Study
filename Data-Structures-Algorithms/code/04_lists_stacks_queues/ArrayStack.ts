import { Stack, List } from './types';
import { ArrayList } from './ArrayList';

export const ArrayStack = <T>(xs: List<T> = ArrayList<T>()): Stack<T> => ({
  count: () => xs.length(),

  clear: () => ArrayStack(xs.clear()),

  push: (item: T) => ArrayStack<T>(xs.append(item)),

  pop: () => {
    if (xs.length() === 0) {
      return;
    }
    const index = xs.length() - 1;
    const result = xs.at(index).remove();
    if (result) {
      const [value, ys] = result;
      return [value, ArrayStack(ys)];
    }
  },

  peek: () => xs.at(xs.length() - 1).value(), 

  toArray: () => xs.toArray(),
});
// export default class ArrayStack<T> implements Stack<T> {
//   public static Of<R>(xs: R[] = []): Stack<R> {
//     return new ArrayStack<R>(xs);
//   }

//   private xs: { [index: number]: T };
//   private top: number = 0;

//   private constructor(xs: T[]) {
//     this.xs = arrayToObject(xs);
//     this.top = xs.length;
//   }

//   get count(): number {
//     return this.top;
//   }

//   clear(): void {
//     Object.assign(this, {
//       xs: Object.create(null),
//       top: 0,
//     });
//   }

//   push(item: T): void {
//     this.xs[this.top++] = item;
//   }

//   pop(): T | undefined {
//     if (this.top === 0) {
//       throw new RangeError('Stack is empty');
//     }

//     const value = this.xs[--this.top];
//     delete this.xs[this.top];
//     return value;
//   }

//   peek(): T {
//     if (this.top === 0) {
//       throw new RangeError('Stack is empty');
//     }
//     return this.xs[this.top - 1];
//   }

//   toArray(): T[] {
//     const ys: T[] = [];
//     for (let i = 0; i < this.top; ++i) {
//       ys.push(this.xs[i]);
//     }
//     return ys;
//   }
// }
