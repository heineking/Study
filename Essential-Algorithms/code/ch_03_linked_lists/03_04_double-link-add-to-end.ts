/*
  Write an algorithm to add an item at the bottom of a doubly linked list.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createList } from './lib/double-link';

describe(basename, () => {

  const data = [
    [],
    [1],
    [0, 1],
    [0, 1, 2]
  ];

  data.forEach((xs) => {

    it(`should add items to end of the list using ${JSON.stringify(xs)} as source`, () => {
      // arrange
      const list = createList<number>();

      // act
      xs.forEach(list.push);

      // assert
      expect(list.toArray()).to.eql(xs);
      expect(list.reverse().toArray()).to.eql(xs.slice().reverse());
    });

  });

});
