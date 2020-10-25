/*
  How can you use the GCD to calculate the LCM?
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import gcd from './lib/gcd';

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

describe(basename, () => {
  it('should return lcm(24, 60) === 120', () => {
    expect(lcm(24, 60)).to.equal(120);
  });
});