/*
  Write a program similar to the one shown in Figure 3.14 that
  compares the times needed by selectionsort and insertionsort to
  sort a list of items. Which is faster?
*/

/*
  Selection sort is generally slower. Repeated runs shows that
  insertion sort is about 10% faster than selection sort for
  lists of length 10,000.

  results for one run:
    -insertion: 303.713392
    -selection: 328.854202
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import { createList } from './lib/double-link';
import insertionSort from './lib/double-link/insertionSort';
import selectionSort from './lib/double-link/selectionSort';

const repeat = <T>(fn: () => T, n: number) => {
  const xs: T[] = [];
  for (let i = 0; i < n; ++i) {
    xs.push(fn());
  }
  return xs;
};

const timed = (fn: (...args: any[]) => any): (...args: any[]) => { result: any, executionTime: number } => {
  return (...args: any[]): any => {
    const start = process.hrtime();
    const result = fn(...args);
    const hrtime = process.hrtime(start);

    const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
    const milliseconds = nanoseconds / 1e6;

    return {
      result,
      executionTime: milliseconds,
    };
  };
};

describe(basename, () => {

  const sorters = {
    selectionSort: selectionSort<number>((a, b) => a < b),
    insertionSort: insertionSort<number>((a, b) => a < b),
  };

  Object.entries(sorters).forEach(([name, sorter]) => {

    describe(name, () => {
      const sortArrayAsc = (xs: number[]) => [...xs].sort((a, b) => a < b ? 1 : a > b ? -1 : 0);

      it('should sort empty lists', () => {
        // arrange
        const list = createList<number>();

        // act
        list.sort(sorter);

        // assert
        expect(list.toArray()).to.eql([]);
      });

      it('should sort list of length 1', () => {
        // arrange
        const list = createList<number>();
        list.insert(0);

        // act
        list.sort(sorter);

        // assert
        expect(list.toArray()).to.eql([0]);
      });

      it('should sort [0, 1] to largest descending', () => {
        // arrange
        const list = createList<number>();
        list.push(0);
        list.push(1);

        // act
        list.sort(sorter);

        // assert
        expect(list.toArray()).to.eql([1, 0]);
      });

      it('should sort randomly generated list', () => {
        // arrange
        const list = createList<number>();
        const xs = repeat(Math.random, 100);
        xs.forEach(list.push);

        // act
        list.sort(sorter);

        // assert
        const expected = sortArrayAsc(xs);
        expect(list.toArray()).to.eql(expected);
      });
    });
  });

  it('should compare algorithms', () => {
    // arrange
    const list1 = createList<number>();
    const list2 = createList<number>();

    const xs = repeat(Math.random, 10000);
    xs.forEach(list1.push);
    xs.forEach(list2.push);

    // act
    const selectionSortResult = timed(list1.sort)(selectionSort<number>((a, b) => a < b));
    const insertionSortResult = timed(list2.sort)(insertionSort<number>((a, b) => a < b));

    // assert
    console.log(`\t-insertion: ${insertionSortResult.executionTime}`);
    console.log(`\t-selection: ${selectionSortResult.executionTime}`);
    expect(true).to.eql(true);
  });
});
