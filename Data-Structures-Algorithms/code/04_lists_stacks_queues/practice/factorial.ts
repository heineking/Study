import { Stack } from '../types';

function factorial(stack: Stack<number>, n: number): number {
  if (n < 0 || n > 12) {
    throw new Error('overflow');
  }

  // load the stack
  while (n > 1) {
    stack = stack.push(n);
    n -= 1;
  }

  // compute the result
  let result = 1;
  while (stack.count() > 0) {
    let value: number;
    [value, stack] = stack.pop();
    result = result * value;
  }

  return result;

}

export default factorial;
