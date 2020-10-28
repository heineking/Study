/*
  Write an algorithm to use a fair six-sided die to generate coin flips.
*/
const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import createDie from './lib/createDie';
import createCoin from './lib/createCoin';
import flipCoin from './lib/flipCoin';
import getDistribution from './lib/getDistribution';
import prng from './lib/prng';

const n = 10000;
const die = createDie(prng(0));
const coin = createCoin(() => die() <= 3);
const flips = flipCoin(coin, n);

const results: any = getDistribution(flips);
const marginOfError = 0.01;

describe(basename, () => {

  const data: [string, number][] = [
    ['tails', 0.5],
    ['heads', 0.5],
  ];

  data.forEach(([side, probability]) => {
    it(`should return ${side} with probability ${probability} +/- ${marginOfError} for ${n} flips`, () => {
      const result = results[side];
      const min = probability - marginOfError;
      const max = probability + marginOfError;

      expect(result).to.be.greaterThan(min);
      expect(result).to.be.lessThan(max);
    });
  });
});