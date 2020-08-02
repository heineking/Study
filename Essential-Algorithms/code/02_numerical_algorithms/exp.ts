
const fast = (x: number, y: number): number => {
  if (y === 0) {
    return 1;
  }
  return (y % 2 === 1)
    ? x * fast(x, y - 1)
    : fast(x * x, y / 2);
};

/*
  Q: 3^5 % 7

  - ((3^2)^2) x 3 % 7
  - (((3^2 % 7)^2 % 7) x 3) % 7
  - (((9 % 7)^2 % 7) x 3) % 7
  - ((2^2 % 7) x 3) % 7
  - ((4 % 7) x 3) % 7
  - (4 x 3) % 7
  - 12 % 7
  - 5

*/
const fastModExp = (x: number, y: number, m: number): number => {
  if (y === 0) {
    return 1;
  }

  const exp = y % 2 === 1
    ? x * fast(x, y - 1)
    : fast(x, y / 2);

  return exp % m;
};

export default {
  fast,
  fastModExp,
};
