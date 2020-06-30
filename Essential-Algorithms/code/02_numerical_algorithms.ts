import { expect } from 'chai';
import { createBrotliDecompress } from 'zlib';

describe('1. Write an algorithm to use a fair six sided die', () => {

  const createPRNG = (seed: number) => {
    const a = 33179;
    const b = 54421;
    const m = 18973;
    let x = seed;

    // (a*x + b) % m
    return () => ((x = (a * x + b) % m) / m);
  };

  const createRand = (min: number, max: number, gen: () => number) => () => min + Math.floor(gen() * (max - min + 1));
  const createDie = (seed: number) => createRand(1, 6, createPRNG(seed));

  const die = createDie(59);

  const coin = () => die() <= 3 ? 'tails' : 'heads';

  it('should use a (mostly) fair six sided die', () => {
    const counts: { [n: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const rolls = 10000;

    for (let i = 0; i < rolls; ++i) {
      const n = die();
      counts[n] += 1;
    }

    const dists = Object
      .values(counts)
      .map((count) => count / rolls);

    const expected = 1 / 6;

    for (const dist of dists) {
      const diff = Math.abs(dist - expected);
      expect(diff).to.be.lessThan(0.05);
    }
  });

  it('should use die to create coin flip', () => {
    const count = { tails: 0, heads: 0 };

    const flips = 100000;
    for (let i = 0; i < flips; ++i) {
      count[coin()] += 1;
    }

    const dists = Object.values(count).map((result) => result / flips);
    const expected = 1 / 2;

    for (const dist of dists) {
      expect(dist - expected).to.be.lessThan(0.05);
    }
  });
});
