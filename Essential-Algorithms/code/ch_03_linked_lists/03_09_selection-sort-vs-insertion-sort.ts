/*

*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import { createList } from './lib/double-link';
import selectionSort from './lib/double-link/selectionSort';

const repeat = <T>(fn: () => T, n: number) => {
  const xs: T[] = [];
  for (let i = 0; i < n; ++i) {
    xs.push(fn());
  }
  return xs;
};

describe(basename, () => {

  describe('selectionSort', () => {

    const sortNumbers = selectionSort<number>((a, b) => a < b);
    const sortArrayAsc = (xs: number[]) => [...xs].sort((a, b) => a < b ? 1 : a > b ? -1 : 0);

    it('should sort empty lists', () => {
      // arrange
      const list = createList<number>();

      // act
      list.sort(sortNumbers);

      // assert
      expect(list.toArray()).to.eql([]);
    });

    it('should sort list of length 1', () => {
      // arrange
      const list = createList<number>();
      list.insert(0);

      // act
      list.sort(sortNumbers);

      // assert
      expect(list.toArray()).to.eql([0]);
    });

    it('should sort [0, 1] to largest descending', () => {
      // arrange
      const list = createList<number>();
      list.push(0);
      list.push(1);

      // act
      list.sort(sortNumbers);

      // assert
      expect(list.toArray()).to.eql([1, 0]);
    });

    it('should sort randomly generated list', () => {
      // arrange
      const list = createList<number>();
      const xs = repeat(Math.random, 100);
      xs.forEach(list.push);

      // act
      list.sort(sortNumbers);

      // assert
      const expected = sortArrayAsc(xs);
      expect(list.toArray()).to.eql(expected);
    });

  });

});
