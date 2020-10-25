/*
  The following pseudocode shows how the sieve of
  Eratosthenes crosses out multiples of the prime next_prime:

  // "Cross out" multiples of this prime
  For i = next_prime * 2 To max_number Step next_prime Then
    is_composite[i] = true
  Next i

  The first value crossed out is next_prime * 2. But you know
  that this value was already crossed out because it is a multiple
  of 2; the first thing the algorithm did was cross out multiples
  of 2. How can you modify this loop to avoid revisiting that value
  and many others that you have already crossed out?
*/
/*
  The algorithm can be improved by skipping the primes that were already
  visited in previous iteration. The smallest factor of the prime that
  was not a factor of a previous prime is (next_prime * next_prime)

  max_number = 100;
  stop_at = 10

  nextPrime = 3
    - 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51 ...
  nextPrime = 5
    - 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
  nextPrime = 7
    - 7, 14, 21, 28, 35, 42, 49, 56
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

const sqrt = (n: number) => Math.floor(Math.pow(n, 0.5));

const sieveOfEratothenes = (n: number) => {
  let ops = 0;
  const isComposite = Array<boolean>(n + 1).fill(false);

  // cross out multiples of two
  for (let i = 4; i <= n; i += 2) {
    ops += 1;
    isComposite[i] = true;
  }

  // cross out multiples of prime
  let nextPrime = 3;
  const stopAt = sqrt(n);

  while (nextPrime <= stopAt) {
    ops += 1;
    // cross out multiples of the nextPrime
    for (let i = nextPrime * 2; i < n; i += nextPrime) {
      ops += 1;
      isComposite[i] = true;
    }

    // get next prime, skipping even numbers
    nextPrime += 2;
    while (nextPrime <= n && isComposite[nextPrime]) {
      ops += 1;
      nextPrime += 2;
    }
  }

  const xs: number[] = [];

  isComposite
    .slice(2)
    .forEach((composite, index) => {
      ops += 1;
      if (!composite) {
        xs.push(index + 2);
      }
    });

  return { sieve: xs, ops };
};

const sieveOfEratothenes2 = (n: number) => {
  let ops = 0;
  const isComposite = Array<boolean>(n + 1).fill(false);

  // cross out multiples of two
  for (let i = 4; i <= n; i += 2) {
    ops += 1;
    isComposite[i] = true;
  }

  // cross out multiples of prime
  let nextPrime = 3;
  const stopAt = sqrt(n);

  while (nextPrime <= stopAt) {
    ops += 1;
    // cross out multiples of the nextPrime
    for (let i = nextPrime * nextPrime; i <= n; i += nextPrime) {
      ops += 1;
      isComposite[i] = true;
    }

    // get next prime, skipping even numbers
    nextPrime += 2;
    while (nextPrime <= n && isComposite[nextPrime]) {
      ops += 1;
      nextPrime += 2;
    }
  }

  const xs: number[] = [];

  isComposite
    .slice(2)
    .forEach((composite, index) => {
      ops += 1;
      if (!composite) {
        xs.push(index + 2);
      }
    });

  return { sieve: xs, ops };
};

describe(basename, () => {
  const data = [
    10,
    100,
    1000,
    100000,
  ];
  data.forEach((n) => {
    it(`should take less operations each sieveOfEratothenes(...) function`, () => {
      const result1 = sieveOfEratothenes(n);
      const result2 = sieveOfEratothenes2(n);

      expect(result2.sieve).to.eql(result1.sieve);
      expect(result2.ops).to.be.lessThan(result1.ops);
    });
  });
});
