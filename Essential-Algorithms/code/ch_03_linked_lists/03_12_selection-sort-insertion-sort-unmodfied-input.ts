/*
  In what state is the input list after executing the
  insertionsort and selectionsort algorithms? Can you think of a
  way to make them both leave the input list unchanged?
*/

/*
  The insertion sort does not modify the input list. The selection
  sort could be modified to mark the visited items.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import { createList } from './lib/double-link';
import selectionSort2 from './lib/double-link/selectionSort2';
import insertionSort from './lib/double-link/insertionSort';

import repeat from './lib/repeat';
import timed from './lib/timed';


describe(basename, () => {
  const sorter = selectionSort2<number>((a, b) => a < b);
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

    // act
    list.push(0)
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

  it('should compare algorithms', function() {
    this.timeout(5000);

    // arrange
    const list1 = createList<number>();
    const list2 = createList<number>();

    const xs = repeat(Math.random, 10000);
    xs.forEach(list1.push);
    xs.forEach(list2.push);

    // act
    const selectionSortResult = timed(list1.sort)(selectionSort2<number>((a, b) => a < b));
    const insertionSortResult = timed(list2.sort)(insertionSort<number>((a, b) => a < b));

    // assert
    console.log(`\t-insertion: ${insertionSortResult.executionTime}`);
    console.log(`\t-selection: ${selectionSortResult.executionTime}`);
    expect(true).to.eql(true);
  });

});
