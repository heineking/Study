import { expect } from 'chai';
import ArrayQueue from './ArrayQueue';
import { equal } from 'assert';

describe('ArrayQueue', () => {

  describe('#enqueue', () => {

    it('should add an element to the rear of the queue', () => {
      const queue = ArrayQueue.Of<number>(5);
      queue.enqueue(0);
      expect(queue.toArray()).to.eql([0]);
    });

    it('should throw a range error when full', () => {
      const queue = ArrayQueue.Of<number>(1);
      queue.enqueue(0);
      expect(() => queue.enqueue(1)).to.throw(RangeError);
    });

  });

  describe('#dequeue', () => {

    it('should remove item from front of queue', () => {
      const queue = ArrayQueue.Of<number>(3);
      queue.enqueue(0);
      queue.enqueue(1);
      expect(queue.dequeue()).to.eql(0); 
    });

    it('should throw a range error when empty', () => {
      const queue = ArrayQueue.Of<number>(3);
      queue.enqueue(0);
      queue.dequeue();
      expect(() => queue.dequeue()).to.throw(RangeError);
    });
  });

  describe('#peek', () => {

    it('should peek at the front of the queue', () => {
      const queue = ArrayQueue.Of<string>(5);
      queue.enqueue('a');
      queue.enqueue('b');
      expect(queue.peek()).to.eql('a');
    });

    it('should throw a range error when queue is empty', () => {
      const queue = ArrayQueue.Of<string>(5);
      expect(() => queue.peek()).to.throw(RangeError);
    });
  });

  describe('#count', () => {
    const queue = ArrayQueue.Of<number>(3);

    it('should return 0 when empty', () => {
      expect(queue.count).to.eql(0);     
    });

    it('should return 1 when queue has item', () => {
      queue.enqueue(0);
      expect(queue.count).to.equal(1);
    });

    it('should return 0 when all items are dequeued', () => {
      queue.dequeue();
      expect(queue.count).to.equal(0)
    });
  })

});
