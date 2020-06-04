import { expect } from 'chai';
import { ArrayStack } from './ArrayStack';

describe('Stack', () => {

  it('should initialize empty', () => {
    const stack = ArrayStack<number>();
    expect(stack.toArray()).to.eql([]);
  });

  describe('#peek', () => {

    it('should return top of stack', () => {
      const stack = ArrayStack<number>().push(0).push(1).push(2);
      expect(stack.peek()).to.equal(2);
    });

  });

  describe('#push', () => {

    it('should add item to top of stack', () => {
      let stack = ArrayStack<number>().push(0);
      expect(stack.peek()).to.equal(0);
      stack = stack.push(1);
      expect(stack.peek()).to.equal(1);
    });

  });

  describe('#pop', () => {

    it('should remove item from top of stack', () => {
      let stack = ArrayStack<number>().push(0).push(1);
      let value: number;
      [value, stack] = stack.pop();
      expect(value).to.equal(1);
      expect(stack.peek()).to.equal(0);
    });

  });
});