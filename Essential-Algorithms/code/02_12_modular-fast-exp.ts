import { expect } from 'chai';

/*
  How would you need to change the fast exponentiation algorithm
  to implement modular fast exponentiation?
*/

const basename = __filename.split('/').slice(-1)[0];

const exp = (x: number, y: number): number => {
  if (y === 0) {
    return 1;
  }

  return y % 2 === 1
    ? x * exp(x, y - 1)
    : exp(x * x, y / 2);
};

const modExp = (x: number, y: number, m: number): number => {
  if (y === 0) {
    return 1;
  }
  return y % 2 === 1
    ? (x * modExp(x, y - 1, m)) % m
    : modExp((x * x) % m, y / 2, m);
};

describe(basename, () => {

  describe('exp', () => {

    const data = [
      [3, 3, Math.pow(3, 3)],
      [4, 7, Math.pow(4, 7)],
      [7, 3, Math.pow(7, 3)],
    ];

    data.forEach(([x, y, expected]) => {
      it(`should calculate ${x}^${y} = ${expected}`, () => {
        expect(exp(x, y)).to.equal(expected);
      });
    });
  });

  describe('ModExp', () => {

    const data = [
      [5, 117, 19, 1],
      [7, 256, 13, 9]
    ];

    data.forEach(([x, y, m, expected]) => {
      it(`should calculate ${x}^${y} mod ${m} = ${expected}`, () => {
        const actual = modExp(x, y, m);
        expect(actual).to.equal(expected);
      });
    });
  });

});
