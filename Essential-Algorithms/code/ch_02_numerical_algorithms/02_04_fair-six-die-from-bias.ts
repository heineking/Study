/*
  Write an algorithm to use a biased six-sided die to generate
  fair values between 1 and 6. How efficient is this algorithm?
*/

/*
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

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import prng from './lib/prng';
import createDie from './lib/createDie';
import fairify from './lib/fairify';
import repeat from './lib/repeat';
import getDistribution from './lib/getDistribution';

const probabilities: [number, number][] = [
  [0.20, 1],
  [0.20, 2],
  [0.15, 3],
  [0.15, 4],
  [0.15, 5],
  [0.15, 6]
];

const probabilityBySide: any = probabilities.reduce((acc, [prob, side]) => ({
  ...acc,
  [side]: prob,
}), {});

const biasedDie = createDie(prng(), 6, probabilities);
const fairDie = fairify(biasedDie, 6);

const forEachSide = (game: any, fn: (side: string, prob: number) => void) => {
  Object.entries(getDistribution(game)).forEach(([side, prob]) => fn(side, prob))
};

describe(basename, () => {

  describe('biasedDie', () => {
    const n = 20000;
    const marginOfError = 0.01;
    const game = repeat(biasedDie, n);

    forEachSide(game, (side, prob) => {
      const expected = probabilityBySide[side];
      const actual = prob;
      it(`should roll ${side} with probability ${expected} +/- ${marginOfError}`, () => {
        expect(actual).to.be.at.least(expected - marginOfError);
        expect(actual).to.be.below(expected + marginOfError);
      });
    });
  });

  describe('fairDie', () => {
    const n = 20000;
    const expected = 1/6;
    const marginOfError = 0.01;
    const game = repeat(fairDie, n);

    forEachSide(game, (side, prob) => {
      const actual = prob;
      it(`should roll ${side} with probability 1/6th +/- ${marginOfError}`, () => {
        expect(actual).to.be.at.least(expected - marginOfError);
        expect(actual).to.be.below(expected + marginOfError);
      });
    });
  });
});
