/*
  Suppose you have a sorted doubly linked list holding names. Can
  you think of a way to improve search performance by starting
  the search from the bottom sentinel instead of the top
  sentinel? Does that change the Big(O) run time?
*/

/*
  Starting from the bottom could help if the inserted item is
  towards the end of the alphabet and the list has evenly
  distributed names. The same is true for starting at the top
  and the name being at the beginning of the alphabet.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createSortedList } from './lib/double-link-sorted';

describe(basename, () => {

  const data = [12, 16, 4, 11, 2, 1];
  data.forEach((x, index, xs) => {

    const ys = xs.slice(0, index + 1);
    const lt = (a: number, b: number) => a < b;

    it(`should insert ${JSON.stringify(ys)} in order`, () => {
      // arrange
      const expected = [...ys].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      const list = createSortedList<number>(lt);

      // act
      ys.forEach(list.insert);

      // assert
      expect(list.toArray()).to.eql(expected);
    });

  });

});
