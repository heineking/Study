export function sum(n: number): number {
  let j = 0;
  for(let i = 0; i <= n; ++i) {
    j += i;
  }
  return j;
}

export function faulty(message: string): void {
  throw new Error(message);
}

export default sum;
