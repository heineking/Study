import { expect } from 'chai';
import ArrayStack from './ArrayStack';

describe('Stack', () => {
  it('should initialize empty', () => {
    const stack = ArrayStack.Of<number>();
    expect(stack.toArray()).to.eql([]);
  });

  it('should initialize with passed in array', () => {
    const stack = ArrayStack.Of<number>([0, 1, 2]);
    expect(stack.toArray()).to.eql([0, 1, 2]);
  });

  describe('#peek', () => {

    it('should return top of stack', () => {
      const stack = ArrayStack.Of<number>([0, 1, 2]);
      expect(stack.peek()).to.equal(2);
    });

  });

  describe('#push', () => {

    it('should add item to top of stack', () => {
      const stack = ArrayStack.Of<number>();
      stack.push(0);
      expect(stack.peek()).to.equal(0);
      stack.push(1);
      expect(stack.peek()).to.equal(1);
    });

  });

  describe('#pop', () => {

    it('should remove item from top of stack', () => {
      const stack = ArrayStack.Of<number>([0, 1]);
      expect(stack.pop()).to.equal(1);
      expect(stack.peek()).to.equal(0);
    });

  });
});