const sqrt = (n: number) => Math.floor(Math.pow(n, 0.5));

const randomBigInt = (len: number): bigint => {
  const digits = [];
  while (digits.length < len) {
    const d = Math.floor(Math.random() * 10);
    if (digits.length > 1 || d !== 0) {
      digits.push(d);
    }
  }
  return BigInt(digits.join(''));
};

/**
 * Implements Fermats theorem for testing prime.
 * Returns 1/2 ^ k probablity that the number is
 * prime.
 * @param p Number to test for primality
 * @param maxTests Number of times to test for prime
 */
const isPrime = (p: number | bigint, k: number): boolean => {
  p = BigInt(p);

  let j = 0;
  while (j < k) {
    const n = 1n + (randomBigInt(`${p}`.length + 1) % (p - 1n));
    const m = (n ** (p - 1n)) % p

    if (m !== 1n) {
      return false;
    }

    j += 1;
  }

  return true;
};

/**
 * Uses the sieve of Eratosthenes to find all
 * primes up to a certain number
 *
 * @param n max number to look for primes
 */
const findPrimes = (n: number): number[] => {
  const isComposite: boolean[] = Array<boolean>(n);

  // cross out multiples of two
  for (let i = 4; i <= n; i += 2) {
    isComposite[i] = true;
  }

  // cross out multiples of prime
  let nextPrime = 3;
  const stopAt = sqrt(n);

  while (nextPrime <= stopAt) {

    // cross out multiples of prime
    for (let i = 3; (i * nextPrime) <= n; i += 2) {
      isComposite[(i * nextPrime)] = true;
    }

    // go to next prime
    nextPrime += 2;
    while (nextPrime <= n && isComposite[nextPrime]) {
      nextPrime += 2;
    }
  }

  // pull out the primes
  const primes: number[] = [];
  // console.log(isComposite);
  for (let i = 2; i < n; ++i) {
    if (!isComposite[i]) {
      primes.push(i);
    }
  }

  return primes;
};

/**
 * @param n number that is factored
 */
const findFactors = (n: number): number[] => {
  if (n === 1) {
    return [1];
  }

  const factors = [];

  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }

  let i = 3;
  let maxFactor = sqrt(n);

  while (i <= maxFactor) {

    while (n % i === 0) {
      factors.push(i);
      n /= i;
      maxFactor = sqrt(n);
    }

    i += 2;
  }

  if (n > 1) {
    factors.push(n);
  }

  return factors;
};

export default {
  findFactors,
  findPrimes,
  isPrime,
};