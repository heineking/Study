/*
  The section “Getting Fairness from Biased Sources” explains how you can use
  a biased coin to get fair coin flips by flipping the coin twice. However,
  sometimes doing two flips produces no result, so you need to repeat the
  process. Suppose that the coin produces heads three-fourths of the time and
  tails one-fourth of the time. In that case, what is the probability that
  you'll get no result after two flips and have to try again?
*/

/*
  Probabilities:
    - Heads = 0.75
    - Tails = 0.25

  Answer:

    There are four combinations that can occur with two flips:
    - {Heads, Tails}, {0.75, 0.25}, 0.1875
    - {Heads, Heads}, {0.75, 0.75}
    - {Tails, Heads}, {0.25, 0.75}, 0.1875
    - {Tails, Tails}, {0.25, 0.25}

    The number of times we can expect a result would be 0.375
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import prng from './lib/prng';
import repeat from './lib/repeat';
import unique from './lib/unique';

import createDie from './lib/createDie';
import createCoin from './lib/createCoin';
import flipCoin from './lib/flipCoin';

const n = 15000;
const die = createDie(prng(), 8);
const coin = createCoin(() => die() <= 6);

const flips = repeat(() => flipCoin(coin, 2), n);
const results = flips.map(unique).filter((xs) => xs.length === 2);
const actual = results.length / n;

const marginOfError = 0.01;
const expected = 0.375;

describe(basename, () => {
  it(`should return result with probability ${expected} and margin of error ${marginOfError}`, () => {
    expect(actual).to.be.greaterThan(expected - marginOfError);
    expect(actual).to.be.lessThan(expected + marginOfError);
  });
});
