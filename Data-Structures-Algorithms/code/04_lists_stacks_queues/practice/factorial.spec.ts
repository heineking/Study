import { expect } from 'chai';
import factorial from './factorial';
import ArrayStack from '../ArrayStack';

describe('factorial', () => {

  it('should calculate 3! = 6', () => {
    const stack = ArrayStack.Of<number>();
    const result = factorial(stack, 3);
    expect(result).to.equal(6);
  });

  it('should calculate 6! = 720', () => {
    const stack = ArrayStack.Of<number>();
    const result = factorial(stack, 6);
    expect(result).to.equal(720);
  });

});