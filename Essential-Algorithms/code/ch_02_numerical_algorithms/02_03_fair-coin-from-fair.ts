/*
  Again, consider the coin described in Exercise 2. This time,
  suppose you were wrong and the coin is actually fair but
  you're still using the algorithm to get fair flips from a
  biased coin. In that case, what is the probability that you'll
  get no result after two flips and have to try again?
*/

/*
  Probabilities:
    - Heads = 0.50
    - Tails = 0.50

  Answer:

    There are four combinations that can occur with two flips:
    - {Heads, Tails}, {0.50, 0.50}, 0.50
    - {Heads, Heads}, {0.50, 0.50}
    - {Tails, Heads}, {0.50, 0.50}, 0.50
    - {Tails, Tails}, {0.50, 0.50}

    The number of times we can expect a result would be 0.50
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
const coin = createCoin(() => die() <= 4);

const flips = repeat(() => flipCoin(coin, 2), n);
const results = flips.map(unique).filter((xs) => xs.length === 2);
const actual = results.length / n;

const marginOfError = 0.01;
const expected = 0.50;

describe(basename, () => {
  it(`should return result with probability ${expected} and margin of error ${marginOfError}`, () => {
    expect(actual).to.be.greaterThan(expected - marginOfError);
    expect(actual).to.be.lessThan(expected + marginOfError);
  });
});