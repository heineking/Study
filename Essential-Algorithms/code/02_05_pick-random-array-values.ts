/*
  Write an algorithm to pick M random values from an array containing
  N items (where M < N). What is its run time? How does this apply to
  the example described in the text where you want to give books to
  five people selected from 100 entries? What if you got 10,000
  entries?
*/

/*
  Run time is O(M). The runtime stays the same regardless of the total
  size of the array.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import flatten from './lib/flatten';
import getDistribution from './lib/getDistribution';
import pickRandomItems from './lib/pickRandomItems';
import prng from './lib/prng';
import repeat from './lib/repeat';

const xs = [1, 2, 3, 4, 5];
const m = 2;

const n = 10000;
const marginOfError = 0.01;
const expected = 1 / xs.length;

describe(basename, () => {
  const ys = flatten(repeat(() => pickRandomItems(prng(), xs, m), n));
  const result = getDistribution(ys);

  Object.entries(result).forEach(([x, dist]) => {

    it(`should pick ${x} with ${expected} +/- ${marginOfError} distribution`, () => {
      expect(dist).to.be.below(expected + marginOfError);
      expect(dist).to.be.at.least(expected - marginOfError);
    });

  });
});
