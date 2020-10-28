/**
 * Flips the coin specified number of times and returns
 * an array of the results.
 * @param coin returns 'tails' or 'heads'
 * @param n number of times to flip coin
 * @returns array of 'tails' or 'heads'
 */
const flipCoin = (coin: () => 'tails' | 'heads', n: number) => {
  const xs: string[] = [];
  for (let i = 0; i < n; ++i) {
    xs.push(coin());
  }
  return xs;
};

export default flipCoin;
