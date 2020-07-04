// https://www.geeksforgeeks.org/pseudo-random-number-generator-prng/
/*
  Xn+1 = (aXn + c) mod m
  where X is the sequence of pseudo-random values
    m, 0 < m        - modulus
    a, 0 < a < m    - multiplier
    c, 0 ≤ c < m    - increment
    x0, 0 ≤ x0 < m  - the seed or start value
*/

export type NG = () => number;

export const createPRNG = (seed: number): NG => {
  const m = 3682418981;
  const a = 107496637;
  const c = 71920993;

  let x = seed;
  return () => ((x = (a*x + c) % m) / m);
};

export const createPRIG = (generator: NG, min: number, max: number): NG =>
  () => min + Math.floor(generator() * (max - min + 1));

export const createBNG = (prng: NG, ns: [number, number][]): NG => {
  return () => {
    let value = prng();
    const [n] = ns.find(([_, prob]) => (value -= prob) <= 0) || [];
    if (n === undefined) {
      throw new Error();
    }
    return n;
  };
};
