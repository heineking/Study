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

import {
  createRandomWalk,
  Point,
  Size,
  createSelfAvoidingWalk,
  createCompleteSelfAvoidingWalk,
} from './walks';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

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
    const outcome = play(biasedDie, 50000);
    const diffs = outcome.getDistributionDiffs(biasedProbabilities);

    Object.values(diffs).forEach((diff) => {
      expect(diff).to.be.lessThan(0.015);
    });
  });

  it('should make a fair die out of a biased die', () => {
    const outcome = play(die, 20000);
    expect(outcome.isFair(1/6, 0.015)).to.equal(true);
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
const range = (start: number, end: number) =>
  Array
    .from({ length: (end - start + 1) })
    .map((_, index) => start + index);

const repeat = <R>(fn: () => R, times: number): R[] => Array.from({ length: times }).map(() => fn());

const flatten = <T>(xs: T[][]) => ([] as T[]).concat(...xs);

const getDistributions = (xs: number[], total: number = xs.length) => {

  const counts = xs.reduce((acc, x) => Object.assign(acc, {
    [x]: (acc[x] || 0) + 1,
  }), {} as { [n: number]: number });

  return Object
    .values(counts)
    .map((count) => count / total);
};

const assertDistribution = (dists: number[], expected: number, tolerance: number) =>
  dists.forEach((dist) => expect(Math.abs(dist -  expected)).to.be.lessThan(tolerance));

describe('5. Write an algorithm to pick M random values from an array containing N items (where M <= N)', () => {

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

    assertDistribution(distributions, 1/10, 0.01);
  });

/*
  Exercise 5, Part 2. What is the runtime of the algorithm?
  The runtime of the algorithm is O(M), assuming that slicing the array takes O(1)
*/

});

describe('6. Write an algorithm to deal five cards to players for a poker program.', () => {

  const deck = range(1, 52);

  const chunk = <T>(xs: T[], size: number) => {
    const chunks: T[][] = [];
    for (let i = 0; i < xs.length; i += size) {
      chunks.push(xs.slice(i, i + size));
    }
    return chunks;
  };

  const createDealer = (prng: NG, cards: number[]) => {
    return (players: number, handSize: number) => chunk(pickRandomValues(prng, cards, players * handSize), handSize);
  };

  const dealer = createDealer(createPRNG(113), deck);

  it('should return array of hands', () => {
    const players = 2;
    const handSize = 5;

    const hands = dealer(players, handSize);

    expect(hands.length).to.equal(players);

    hands.forEach((hand) =>
      expect(hand.length).to.equal(5),
    );
  });

  it('should pick cards with equal distribution', () => {
    const players = 3;
    const handSize = 5;
    const numberOfGames = 5000;

    const games = repeat(() => dealer(players, handSize), numberOfGames);
    const cards = flatten(flatten(games));
    const distributions = getDistributions(cards);

    expect(distributions.length).to.equal(52);

    assertDistribution(distributions, 1/52, 0.01);
  });

/*
  Does it matter whether you deal one card to each player in turn until every player has
  five cards or whether you deal five cards all at once to each player in turn?

  Answer:

  It does not matter if the cards are dealt one-by-one or all at once because
  the cards are sufficiently randomized which means there is no bias in the order that
  the cards are dealt.

  The second `it(...)` assert above proves that the cards are dealt without bias.
*/
});

describe('7. Write a program that simulates rolling two six-sided dice', () => {
  const prng1 = createPRNG(42359);
  const die1 = createDie(prng1);

  const prng2 = createPRNG(13859);
  const die2 = createDie(prng2);

  const dice = () => die1() + die2();

  const probabilities = {
    2: 0.0278,
    3: 0.0556,
    4: 0.0833,
    5: 0.1111,
    6: 0.1389,
    7: 0.1667,
    8: 0.1389,
    9: 0.1111,
    10: 0.0833,
    11: 0.0556,
    12: 0.0278
  };

  it('should roll two six-side dice at expected probability', () => {

    const outcome = play(dice, 50000);
    const diffs = outcome.getDistributionDiffs(probabilities);

    Object.values(diffs).forEach((diff) =>
      expect(diff).to.be.lessThan(0.005)
    );
  });
});

const createGrid = (size: Size, walk: Point[]): string[][] => {
  const grid: string[][] = [];
  const pad = (s: string) => `${s}____`.slice(0, 3);

  for (let i = 0; i < size.h; ++i) {
    const row: string[] = [];
    for (let j = 0; j < size.w; ++j) {
      row.push(pad(''));
    }
    grid.push(row);
  }

  walk
    .map((point) => translatePoint(size, point))
    .forEach(([x, y], i) => grid[y][x] = pad(`${i}`));

  return grid;
};

const translatePoint = ({ w, h }: Size, [x1, y1]: Point) => {
  const x2 = (w / 2) + x1;
  const y2 = (h / 2) + y1;
  return [x2, y2];
};

describe('8.# Random walk should return a random array of points', () => {

  const len = 5;
  const size: Size = { w: len * 2, h: len * 2 };

  const randomWalk = createRandomWalk(createPRNG(113));

  const walk = randomWalk(len);
  const grid = createGrid(size, walk);

  it('should produce an array based on size', () => {
    expect(walk).to.be.length(len);
  });

  it('should print grid', () => {
    const str = grid.map((row) => row.join('')).join('\n\t');
    console.log(`\t${str}`);
    expect(true).to.equal(true);
  });
});

describe('8.# Self avoiding array should return non-intersecting points', () => {

  const selfAvoidingWalk = createSelfAvoidingWalk(createPRNG(257));

  it('should not have any duplicate points', ()  => {
    const size: Size = { w: 100, h: 100 };
    const walk = selfAvoidingWalk(size);

    const duplicates = walk.filter(([x1, y1], index) => walk.findIndex(([x2, y2]) => x1 === x2 && y1 === y2) !== index);

    expect(duplicates.length).to.equal(0);
  });

  it('should print grid', () => {
    const size: Size = { w: 6, h: 6 };
    const walk = selfAvoidingWalk(size);

    const grid = createGrid(size, walk);
    const str = `\t${grid.map((row) => row.join('')).join('\n\t')}`
    console.log(str);

    expect(true).to.equal(true);
  })
});

describe('8. In the complete self-avoiding random walk algorithm, what is the key backtracking step?', () => {

  /*
    The key backtracking step is the recursive call to add the next neighbor to the list of points
  */

  const completeSelfAvoidingWalk = createCompleteSelfAvoidingWalk(() => Math.random());

  const size: Size = { w: 6, h: 6 };
  const length = (size.w - 1) * (size.h - 1);
  const walk = completeSelfAvoidingWalk(size);

  it('should not have duplicate points', () => {
    const duplicates = walk.filter(([x1, y1], index) => walk.findIndex(([x2, y2]) => x1 === x2 && y1 === y2) !== index);
    expect(duplicates.length).to.equal(0);
  })

  it('should fill entire grid', () => {
    expect(walk.length).to.equal(length);
  });

  it('should print grid', () => {
    const grid = createGrid(size, walk);

    const str = `\t${grid.map((row) => row.join('')).join('\n\t')}`
    console.log(str);

    expect(true).to.equal(true);
  });
});

/*
  Question 9:

  When building a complete self-avoiding random walk, what happens if the algorithm
  does not randomize the neighbor list? Would that change the algorithm's performance?

  Answer:

  Randomizing the neighbors is what makes the complete walk "random". Removing the
  randomize would cause the algorithm to produce the same walk for each run. The
  algorithm slows down from randomizing the neighbors because it leads to more
  backtracking.

*/

import gcd from './gcd';

describe(`10. What happens to Euclid's algorithm if A < B initially?`, () => {
  /*
    Answer:

    A and B are flipped in the first pass of the algoritim.
  */

  const n = 4851;
  const m = 3003;

  it(`gcd(${n}, ${m}) === gcd(${m}, ${n})`, () => {
    expect(gcd(n, m)).to.equal(gcd(m, n));
  });

});

describe('11. How can you use the GCD to calculate the LCM?', () => {
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

  it('should return lcm(24, 60) === 120', () => {
    expect(lcm(24, 60)).to.equal(120);
  });

});

import exp from './exp';

describe(`How would you need to change the fast exponentiation algorithm to implement modular fast exponentiation?`,
() => {

  const expData = [
    { x: 7, y: 3, c: Math.pow(7, 3) },
    { x: 5, y: 5, c: Math.pow(5, 5) },
    { x: 8, y: 7, c: Math.pow(8, 7) },
  ];

  expData.forEach(({ x, y, c }) => {

    it(`exp.fast(x,y) should calculate ${x}^${y} = ${c}`, () => {
      expect(exp.fast(x, y)).to.equal(c);
    });

  });

  const expModData = [
    { x: 5, y: 3, m: 13, c: 8 },
    { x: 3, y: 5, m: 7, c: 5 }
  ];

  expModData.forEach(({ x, y, m, c }) => {
    it(`exp.fastModExp(y, y, m) should calculate ${x}^${y} mod ${m} = ${c}`, () => {
      expect(exp.fastModExp(x, y, m)).to.equal(c);
    });
  });
});

import prime from './prime';

describe('prime', () => {

  describe('findFactors', () => {
    const xs = Array.from<number, number>({ length: 10 }, _ => Math.floor(100000 * Math.random()) + 1);

    xs.forEach((n) => {

      it (`should return prime factors for ${n}`, () => {
        const factors = prime.findFactors(n);
        const result = factors.reduce((x, y) => x * y, 1);
        expect(n).to.eql(result);
      });

    });
  });

  describe('findPrimes', () => {
    const n = 30;
    const expected = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

    it (`should find primes ${JSON.stringify(expected)} when checking up to ${n}`, () => {
      const xs = prime.findPrimes(n);
      expect(xs).to.eql(expected);
    });

  });

  describe('isPrime', () => {

    // because of overflow we cannot apply fermats
    // theorem to very big prime numbers.
    const xs: [number, boolean][] = [
      [3, true],
      [5, true],
      [7, true],
      [8, false],
      [9, false],
      [11, true],
      [13, true]
    ];

    xs.forEach(([n, expected]) => {
      it(`should return true for ${n}`, () => {
        const isPrime = prime.isPrime(n, 10);
        expect(isPrime).to.eql(expected);
      });
    });
  });
});