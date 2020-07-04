import { expect } from 'chai';

import { play } from './play';

import {
  NG,
  createPRNG,
  createPRIG,
  createBNG,
} from './prng';

import {
  pickRandomValues
} from './pick';


const createDie = (generator: NG) => createPRIG(generator, 1, 6);

const createCoin = (die: NG): (() => 'heads' | 'tails') => () => die() <= 3 ? 'heads' : 'tails';

const createBiasedDie = (prng: NG, probabilities: Record<number, number>) =>
  createBNG(prng, Object.entries(probabilities).map(([k, v]) => [+k, v]));

describe('1. Write an algorithm to use a fair six sided die', () => {

  const die = createDie(createPRNG(113));

  const coin = createCoin(die);

  it('should use a (mostly) fair six sided die', () => {
    const outcome = play(die, 100000);
    expect(outcome.isFair(1/6, 0.01)).to.equal(true);
  });

  it('should use die to create coin flip', () => {
    const outcome = play(coin, 10000);
    expect(outcome.isFair(1/2, 0.01)).to.equal(true);
  });

});

describe('4. Write an algorithm to use a biased six-sided die to generate fair values between 1 and 6', () => {

  const biasedProbabilities = {
    1: 0.2,
    2: 0.2,
    3: 0.15,
    4: 0.15,
    5: 0.15,
    6: 0.15
  };

  // need to use the built in PRNG because our implementation is not really
  // that random since it was made for academic purposes rather than "correctness"
  const biasedDie = createBiasedDie(() => Math.random(), biasedProbabilities);

  const die = (): number => {
    const rolls = new Set<number>();
    const roll = biasedDie();
    rolls.add(roll);

    while (rolls.size !== 6) {
      const next = biasedDie();

      if (rolls.has(next)) {
        return die()
      }

      rolls.add(next);
    }

    return roll;
  };

  it('should use a biased die', () => {
    const outcome = play(biasedDie, 10000);
    const diffs = outcome.getDistributionDiffs(biasedProbabilities);

    Object.values(diffs).forEach((diff) => {
      expect(diff).to.be.lessThan(0.01);
    });
  });

  it('should make a fair die out of a biased die', () => {
    const outcome = play(die, 10000);
    expect(outcome.isFair(1/6, 0.01)).to.equal(true);
  });

/*
  Exercise 4, Part 2. How efficient is the biased to fair die algorithm?

  First, let's work this out with a fair 6-sided die. The first roll we make
  can be any number on the die, so that will be probability 1. The next roll
  we can roll any side BUT the first one, which makes the probability of
  a valid roll 5/6. Then next roll can be any side but the two sides from
  before which makes probability 4/6.

  Working this out further we get the following probability:

    1 x 5/6 x 4/6 x 3/6 x 2/6 x 1/6 = 0.0154 or about 1.5%

  The solutions in the book simplifies the above to 6! / 6^6 which is found
  realizing that the fractions simplify to:

    6 x 5 x 4 ... 1       6!
    ----------------  =  ----- = 6! x (1/6)^6  =  0.0154
    6 x 6 x 6 ... 6      6^6

  In words, the probability of rolling all 6 sides of die in 6 tries is the
  total number of permuntations of all 6 sides times the probability of the
  all of sides occurring.

  Now, we can use this to work out the probability of a biased die.

  Assume that we have the following distribution:

    1 = 0.2
    2 = 0.2
    3 = 0.15
    4 = 0.15
    5 = 0.15
    6 = 0.15

  The probability that we roll all the numbers in a row would be:

    Number of permutations = 6!
    Probability of each permutation = 0.2^2 x 0.15^4

    6! x (0.2^2 x 0.15^4) = 0.01458
*/
});

describe('5. Write an algorithm to pick M random values from an array containing N items (where M <= N)', () => {

  const repeat = <R>(fn: () => R, times: number): R[] => Array.from({ length: times }).map(() => fn());

  const flatten = <T>(xs: T[][]) => ([] as T[]).concat(...xs);

  const getDistributions = (xs: number[]) => {

    const counts = xs.reduce((acc, x) => ({
      ...acc,
      [x]: (acc[x] || 0) + 1,
    }), {} as { [n: number]: number });

    return Object
      .values(counts)
      .map((count) => count / xs.length);
  };

  it('should not mutate the original array', () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [...xs];
    const _ = pickRandomValues(createPRNG(113), xs, 5);

    expect(xs).to.eql(expected);
  });

  it('should pick items with a uniform distribution', () => {

    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const m = 2;

    const prng = createPRNG(113);
    const ys = flatten(repeat(() => pickRandomValues(prng, xs, m), 10000));
    const distributions = getDistributions(ys);

    distributions.forEach((dist) => {
      expect(Math.abs(dist - 1/10)).to.be.lessThan(0.01);
    });

  });

/*
  Exercise 5, Part 2. What is the runtime of the algorithm?
  The runtime of the algorithm is O(M), assuming that slicing the array takes O(1)
*/

});
