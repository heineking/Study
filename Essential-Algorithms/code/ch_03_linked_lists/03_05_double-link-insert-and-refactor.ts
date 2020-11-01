/*
  If you compare the algorithms you wrote for Exercises 3 and 4
  to the InsertCell algorithm shown in the section “Doubly Linked
  Lists,” you should notice that they look very similar. Rewrite
  the algorithms you wrote for Exercises 3 and 4 so that they
  call the InsertCell algorithm instead of updating the list's
  links directly.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createList } from './lib/double-link';

describe(basename, () => {

  describe('#at', () => {

    it('should throw error when getting item in empty list', () => {
      const list = createList<number>();
      expect(() => list.at(0)).to.throw();
    });

    it('should throw error when index is out of range', () => {
      const list = createList<number>();
      list.insert(0);
      expect(() => list.at(1)).to.throw();
    });

    const data = [0, 1, 2, 3];
    data.forEach((expected, index, xs) => {

      it(`should return ${expected} when passed index is ${index} and list is ${JSON.stringify(xs)}`, () => {
        // arrange
        const list = createList<number>();
        [...xs].reverse().forEach((x) => list.insert(x));

        // act
        const item = list.at(index);
        const actual = item.value;

        // assert
        expect(actual).to.eql(expected);
      });

    });

  });

  describe('#insert', () => {

    it('should insert item at start of list when "after" is undefined', () => {
      // arrange
      const xs = [0, 1];
      const list = createList<number>();
      const expected = xs.slice().reverse();

      // act
      list.insert(0);
      list.insert(1);

      expect(list.toArray()).to.eql(expected);
    });

    const data = [0, 1, 2];
    data.forEach((_, index, xs) => {

      const value = -1;
      const expected = [...xs];
      expected.splice(index + 1, 0, value);

      it(`should insert ${value} after index ${index} for ${JSON.stringify(xs)}`, () => {
        const list = createList<number>();
        [...xs].reverse().forEach((x) => list.insert(x));

        const after = list.at(index);
        list.insert(value, after);

        expect(list.toArray()).to.eql(expected);
      });

    });
  });
});
