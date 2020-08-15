const sqrt = (n: number) => Math.floor(Math.pow(n, 0.5));

const findFactors = (n: number) => {
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
};
