export const PI = 3.14;

export function sum(n: number): number {
  let j = 0;
  for(let i = 0; i <= n; ++i) {
    j += i;
  }
  return j;
}

export function add2(a: number, b: number): number {
  return a + b;
}

export function faulty(message: string): void {
  throw new Error(message);
}

export default sum;
