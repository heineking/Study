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

import randomizeArray from '../ch_02_numerical_algorithms/lib/randomizeArray';
import swap from './lib/swap-list/swap';

const createWeightedMinMaxSelector = (weights: { [key: number]: number }) => {
  const xs: number[] = [];
  for (const [max, weight] of Object.entries(weights)) {
    for (let i = 0; i < weight; ++i) {
      xs.push(+max);
    }
  }

  return () => {
    const index = Math.floor(Math.random() * xs.length);
    const max = xs[index];
    return [max - 10, max];
  };
};

const compare = (n: number) => {
  const xs = Array(100).fill(0).map((_, i) => i + 1);
  const mtfList = createMtfList<number>();
  const swapList = createSwapList<number>();

  mtfList.add(xs);
  swapList.add(xs);

  let searches = 0;
  const costs: { swap: number, mtf: number } = { swap: 0, mtf: 0 };

  const minMaxSelector = createWeightedMinMaxSelector({
    10: 50,
    20: 5,
    30: 20,
    40: 10,
    50: 30,
    60: 30,
    70: 10,
    80: 40,
    90: 5,
    100: 10
  });

  const search = () => {
    const [min, max] = minMaxSelector();

    const x = Math.floor(Math.random() * (max - min)) + min;
    const mtfCost = mtfList.toArray().indexOf(x) + 1;
    const swapCost = swapList.toArray().indexOf(x) + 1;

    costs.mtf = +(((costs.mtf * searches) + mtfCost) / (searches + 1)).toFixed(3);
    costs.swap = +(((costs.swap * searches) + swapCost) / (searches + 1)).toFixed(3);

    mtfList.find((y) => y === x);
    swapList.find((y) => y === x);

    searches += 1;
  };

  for (let i = 0; i < n; ++i) {
    search();
  }

  return { searches, costs };
};


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

  describe('compare', () => {

    it('swap should eventually get better performance for higher number of searches', () => {
      const data = [100, 500, 1000, 10000, 50000].forEach((n) => {
        console.log(`\t - ${JSON.stringify(compare(n))}`);
      });
    })
  });
});
