/*
  Write an algorithm to add an item at the top of a doubly linked list.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createList } from './lib/double-link';

describe(basename, () => {

  it('should add items to start of array', () => {

    // arrange
    const list = createList<number>();
    const xs = [0, 1, 2, 3];

    // act
    xs.forEach((x) => list.unshift(x));

    // assert
    expect(list.toArray()).to.eql(xs.slice().reverse());
  });

});
