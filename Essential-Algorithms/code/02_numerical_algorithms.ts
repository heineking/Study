import { expect } from 'chai';

const createPRNG = (seed: number) => {
  const a = 33179;
  const b = 54421;
  const m = 18973;
  let x = seed;

  // (a * x + b) % m
  return () => ((x = (a * x + b) % m) / m);
};

type Counts = Record<number, number>;

const rollDie = (die: () => number, times: number): Counts => {
  const counts: Counts = {};
  for (let i = 0; i < times; ++i) {
    const roll = die();
    counts[roll] = (counts[roll] || 0) + 1
  }
  return counts;
};

const getDistributions = (counts: Counts): Counts => {
  const total = Object.values(counts).reduce((m, n) => m + n, 0);
  return Object.entries(counts).reduce((props, [side, count]) => ({
    ...props,
    [side]: count / total,
  }), {});
};

describe('1. Write an algorithm to use a fair six sided die', () => {

  const createRand = (min: number, max: number, gen: () => number) => () => min + Math.floor(gen() * (max - min + 1));

  const createDie = (seed: number) => createRand(1, 6, createPRNG(seed));

  const die = createDie(59);

  const coin = () => die() <= 3 ? 'tails' : 'heads';

  it('should use a (mostly) fair six sided die', () => {
    const counts = rollDie(die, 10000);
    const expected = 1 / 6;
    const dists = Object.values(getDistributions(counts));

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

    const dists = Object
      .values(count)
      .map((result) => result / flips);

    const expected = 1 / 2;

    for (const dist of dists) {
      expect(dist - expected).to.be.lessThan(0.005);
    }
  });

});

describe('4. Write an algorithm to use a biased six-sided die to generate fair values between 1 and 6', () => {

  const pickItemWithProbabilities = <T>(items: T[], probabilities: number[]) => () => {
    let value = Math.random();
    for (let i = 0; i < probabilities.length; ++i) {
      value -= probabilities[i];
      if (value <= 0) {
        return items[i];
      }
    }
    throw new Error(value.toString());
  };

  const biasedDie = pickItemWithProbabilities(
    [1, 2, 3, 4, 5, 6],
    [0.3, 0.3, 0.1, 0.1, 0.1, 0.1]
  );

  const die = (): number => {

    const counts: { [s: number]: true } = {};
    const roll = biasedDie();
    counts[roll] = true;

    while (Object.keys(counts).length !== 6) {
      const next = biasedDie();
      if (counts[next]) {
        return die();
      }
      counts[next] = true;
    }

    return roll;
  };

  it('should use a biased die', () => {
    const counts = rollDie(biasedDie, 10000);
    const distributions = getDistributions(counts);
    const expected: any = { 1: 0.3, 2: 0.3, 3: 0.1, 4: 0.1, 5: 0.1, 6: 0.1 };

    Object.entries(distributions).forEach(([side, dist]) => {
      expect(dist - expected[side]).to.be.lessThan(0.01);
    });
  });

  it('should create a fair die out of a biased die', () => {
    const counts = rollDie(die, 10000);
    const dists = Object.values(getDistributions(counts));

    const expected = 1 / 6;

    for (const dist of dists) {
      expect(dist - expected).to.be.lessThan(0.01);
    }
  });
});
