/*
  What happens to Euclid's algorithm if A < B initially?
*/

/*
  The answer is the same because A and B are flipped in
  the first pass of the algoritim.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import gcd from './lib/gcd';

describe(basename, () => {

  const n = 4851;
  const m = 3003;

  it(`should return gcd(${n}, ${m}) === gcd(${m}, ${n})`, () => {
    const result1 = gcd(m, n);
    const result2 = gcd(n, m);
    expect(result1).to.equal(result2);
  });

});
