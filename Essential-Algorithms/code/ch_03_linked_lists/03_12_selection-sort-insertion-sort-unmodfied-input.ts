/*
  In what state is the input list after executing the
  insertionsort and selectionsort algorithms? Can you think of a
  way to make them both leave the input list unchanged?
*/

/*
  The insertion sort does not modify the input list.

  The source list could be copied to prevent it from being
  changed by selection sort. This does not, however, improve
  performance...but the copy method is relatively inexpensive
  compared to the selection sort algorithm so the added time
  is small.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import { createList } from './lib/double-link';

import selectionSort from './lib/double-link/selectionSort';
import insertionSort from './lib/double-link/insertionSort';

import repeat from './lib/repeat';
import timed from './lib/timed';


describe(basename, () => {

  describe('#copy()', () => {

    it('should copy empty list', () => {
      const list1 = createList();
      const list2 = list1.copy();
      expect(list1.toArray()).to.eql(list2.toArray());
    });

    it('should copy list of length 1', () => {
      // arrange
      const list1 = createList<number>();
      list1.push(0);

      // act
      const list2 = list1.copy();

      // assert
      expect(list2.toArray()).to.eql(list2.toArray());
    });

    it('should copy list of random length', () => {
      // arrange
      const list1 = createList<number>();
      list1.push(0);
      list1.push(1);
      list1.push(2);

      // act
      const list2 = list1.copy();
      list2.push(3);

      // assert
      expect(list1.toArray()).to.eql([0, 1, 2]);
      expect(list2.toArray()).to.eql([0, 1, 2, 3]);
    });
  });

  describe('selectionSort w/ copy', () => {

    it('should compare algorithms', function() {
      this.timeout(5000);

      // arrange
      const list = createList<number>();
      const list1 = createList<number>();

      const xs = repeat(Math.random, 5000);

      xs.forEach(list.push);
      xs.forEach(list1.push);

      // act
      const list2 = list1.copy();
      const arr1 = list.toArray();

      const insertionSortResult = timed(list1.sort)(insertionSort<number>((a, b) => a < b));
      const selectionSortResult = timed(list2.sort)(selectionSort<number>((a, b) => a < b));

      const arr2 = list.toArray();

      // assert
      console.log(`\t-insertion: ${insertionSortResult.executionTime}`);
      console.log(`\t-selection: ${selectionSortResult.executionTime}`);

      expect(arr1).to.eql(arr2)
    });
  });
});
