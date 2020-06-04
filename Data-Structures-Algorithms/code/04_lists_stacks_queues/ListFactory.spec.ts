import { expect } from 'chai';
import { sortedList, createList } from './ListFactory';
import { Compare } from './types';
import { ArrayList } from './ArrayList';

describe('sortedList', () => {

  it('should sort inserted items', () => {

    const cmp: Compare<number> = {
      lt: (a, b) => a < b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
    };

    let xs = sortedList<number>(cmp, ArrayList<number>());
    xs = xs.insert(0).insert(1).insert(2).insert(3);
    expect(xs.toArray()).to.eql([0, 1, 2, 3]);
  });

});

describe('createList', () => {

  it('should wrap created lists', () => {
    const cmp: Compare<number> = { 
      lt: (a, b) => a < b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
    };
    let xs = createList<number>('array', [(ys) => sortedList(cmp, ys)])
    xs = xs.insert(3).insert(2).insert(1);
    expect(xs.toArray()).to.eql([1, 2, 3]);
  });

});