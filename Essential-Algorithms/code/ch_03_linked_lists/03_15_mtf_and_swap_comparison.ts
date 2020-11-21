/*
  The swapping self-organizing list moves items slowly, so it is
  less effective than the MTF list until the items move into good
  positions. Use the program that you wrote for Exercise 14 to
  determine the number of searches required with a 100-item list
  before the swapping list starts to outperform the MTF list.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createSwapList } from './lib/swap-list';
import { createMtfList } from './lib/mtf';

import { Item } from './lib/swap-list/types';
import swap from './lib/swap-list/swap';

describe(basename, () => {

  describe('swap', () => {

    it('should swap items', () => {
      // arrange
      const a: Item<number> = {
        value: 0,
        next: undefined,
        prev: undefined,
      };

      const b: Item<number> = {
        value: 1,
        next: undefined,
        prev: a,
      };

      a.next = b;

      // act
      swap(a, b);

      // assert
      expect(a.prev).to.eql(b);
      expect(a.next).to.eql(undefined);

      expect(b.next).to.eql(a);
      expect(b.prev).to.eql(undefined);
    });
  });

  describe('swapList', () => {

    describe('#add', () => {

      it('should add items to list', () => {
        // arrange
        const list = createSwapList<number>();
        const xs = [0, 1, 2, 3];

        // act
        list.add(xs);

        // assert
        expect(list.toArray()).to.eql(xs);
      });

    });

    describe('#find', () => {

      it('should find items in list', () => {
        // arrange
        const list = createSwapList<number>();
        list.add([0, 1, 2, 3]);

        // act
        const expected = 1;
        const actual = list.find(n => n === 1);

        // assert
        expect(actual).to.equal(expected);
      });

      const xs = [0, 1, 2];
      xs.forEach((x, i) => {

        // setup the expected array
        const ys = [...xs];
        if (i > 0) {
          [ys[i-1], ys[i]] = [ys[i], ys[i-1]];
        }

        it(`should create ${JSON.stringify(ys)} from ${JSON.stringify(xs)} and finding for "${x}"`, () => {
          // arrange
          const list = createSwapList<number>();
          list.add(xs);

          // act
          const result = list.find((n) => n === x);

          // assert
          expect(result).to.eql(x);
          expect(list.toArray()).to.eql(ys);
        });

      });

    });

  });

  describe('mtfList', () => {

    it('should add items to a list', () => {
      // arrange
      const list = createMtfList<number>();

      // act
      list.add([4, 5, 6]);
      list.add([1, 2, 3]);

      // assert
      const expected = [1, 2, 3, 4, 5, 6];
      expect(list.toArray()).to.eql(expected);
    });

    it('should find item in list', () => {
      // arrange
      const list = createMtfList<number>();
      list.add([1, 2, 3]);

      // act
      const expected = 3;
      const actual = list.find((n) => n === 3);

      // assert
      expect(actual).to.eql(expected);
    });

    const xs = [1, 2, 3];
    xs.forEach((x, i) => {

      // setup the expected array
      const ys = [...xs];
      ys.splice(i, 1);
      ys.unshift(x);

      it(`should create ${JSON.stringify(ys)} from ${JSON.stringify(xs)} when finding \"${x}\"`, () => {
        // arrange
        const list = createMtfList<number>();
        list.add(xs);

        // act
        list.find((n) => n === x);

        // arrange
        expect(list.toArray()).to.eql(ys);
      });
    });
  });
});
