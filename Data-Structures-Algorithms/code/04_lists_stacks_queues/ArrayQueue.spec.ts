import { expect } from 'chai';
import { ArrayQueue } from './ArrayQueue';

describe('ArrayQueue', () => {

  describe('#enqueue', () => {

    it('should add an element to the rear of the queue', () => {
      const queue = ArrayQueue<number>().enqueue(0);
      expect(queue.toArray()).to.eql([0]);
    });

  });

  describe('#dequeue', () => {

    it('should remove item from front of queue', () => {
      let queue = ArrayQueue<number>();
      queue = queue.enqueue(0).enqueue(1);
      const [item] = queue.dequeue();
      expect(item).to.eql(0); 
    });

  });

  describe('#peek', () => {

    it('should peek at the front of the queue', () => {
      const queue = ArrayQueue<string>().enqueue('a').enqueue('b');
      expect(queue.peek()).to.eql('a');
    });

  });

  describe('#count', () => {
    let queue = ArrayQueue<number>();

    it('should return 0 when empty', () => {
      expect(queue.count()).to.eql(0);     
    });

    it('should return 1 when queue has item', () => {
      queue = queue.enqueue(0);
      expect(queue.count()).to.equal(1);
    });

    it('should return 0 when all items are dequeued', () => {
      let item!: number;
      [item, queue] = queue.dequeue();
      expect(queue.count()).to.equal(0)
    });
  })

});
