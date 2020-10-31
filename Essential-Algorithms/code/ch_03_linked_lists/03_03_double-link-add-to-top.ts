/*
  Write an algorithm to add an item at the top of a doubly linked list.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createList } from './lib/double-link';

describe(basename, () => {

  describe('reverse', () => {

    const data = [
      [],
      [0],
      [0, 1],
      [0, 1, 2],
      [0, 1, 2, 3],
      [0, 1, 2, 3, 4],
    ];

    data.forEach((xs) => {

      it(`should handle ${JSON.stringify(xs)}`, () => {
        const list = createList<number>();
        xs.forEach(list.unshift);
        expect(list.reverse().toArray()).to.eql(xs);
      });

    });

  });

  describe('unshift', () => {

    it('should add items to start of array', () => {

      // arrange
      const list = createList<number>();
      const xs = [0, 1, 2, 3];

      // act
      xs.forEach((x) => list.unshift(x));

      // assert
      expect(list.reverse().toArray()).to.eql(xs);
    });

  });
});
