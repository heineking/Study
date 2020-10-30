/*
  Write an algorithm to find the largest item in an unsorted
  singly linked list with cells containing integers.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import createList from './lib/single-link/createList';

const findLargest = (acc: number, curr: number) => {
 return acc < curr
    ? curr
    : acc;
};

describe(basename, () => {

  it('should return undefined when list is empty', () => {
    // arrange
    const list = createList<number>();

    // act
    const expected = undefined;
    const actual = list.reduce(findLargest);

    // assert
    expect(actual).to.equal(expected);
  });

  it('should find largest number for list with only one item', () => {
    // arrange
    const list = createList<number>();
    list.push(10);

    // act
    const expected = 10;
    const actual = list.reduce(findLargest);

    // assert
    expect(actual).to.equal(expected);
  });

  it('should find item number in lits of numbers', () => {
    // arrange
    const list = createList<number>();
    const xs = [1, 14, 2, 8, 4, 6, 13, 18, 16, 11];
    xs.forEach((x) => list.push(x));

    // act
    const expected = 18;
    const actual = list.reduce(findLargest);

    // assert
    expect(actual).to.equal(expected);
  });

});