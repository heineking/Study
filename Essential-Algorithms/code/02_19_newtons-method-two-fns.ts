/*
  How could you use Newton's method to find the points
  where two functions intersect?
*/

/*
  https://en.wikipedia.org/wiki/Newton%27s_method

  dfdx =
        f(x + h) - f(x)
        ----------------
               h

  equation of the tangent line at curve y = f(x) where x = x_n:
    y = mx + b
    y = f'(x_n)(x - x_n) + f(x_n)

  solving for 0

    0 = f'(x_n)(x_n+1 - x_n) + f(x_n)
    x_n+1 = -f(x_n) / f'(x_n) + x_n
    x_n+1 = x_n - f(x_n) / f'(x_n)

  An important thing to remember is that 'b' is the point
  of a line that crosses the y-axis. We can set this f(x)
  with out problem and be able to calculate where the tangent
  crosses the x-axis.
*/

import { expect } from 'chai';

const basename = __filename.split('/').slice(-1)[0];

type F = (x: number) => number;

const dfdx = (f: F, x: number, h: number = 1e-8) => (f(x + h) - f(x)) / h;

const newtonsMethod = (f: F, x0: number, maxError: number): number | null => {
  let x = x0;

  for (let i = 0; i < 100; ++i) {
    const y = f(x);

    if (Math.abs(y) < maxError) {
      return x;
    }
    x = x - f(x) / dfdx(f, x);
  }

  return null;
};

describe(basename, () => {

  describe('dfdx', () => {

    const me = 0.0001;

    const data = [
      {
        // https://www.wolframalpha.com/input/?i=derivative+of+x%5E4+sin+x+where+x+%3D+2
        x: 2,
        f: (x: number) => (x**4) * Math.sin(x),
        expected: 22.439168,
      },
      {
        // https://www.wolframalpha.com/input/?i=derivative+%285*x**2+%2B+x**3+-+7*x**4%29+%2F+x
        x: 17,
        f: (x: number) => (5*x**2 + x**3 - 7*x**4) / x,
        expected: -6030,
      }
    ];

    data.forEach(({ x, f, expected }) => {

      const str = Object.entries({ x, f, expected, me }).map((entry) => entry.join(': ')).join('\n\t- ');

      it(`should calculate numerical derivative:\n\t- ${str}`, () => {
        const actual = dfdx(f, x);
        const diff = Math.abs(expected - actual);
        expect(diff).to.be.lessThan(0.001);
      });

    });
  });

  describe('newtonsMethod', () => {

    const data = [
      {
        x0: 1.5,
        f: (x: number) => -4 * x**2 + 8*x,
        expected: 2,
      },
      {
        x0: 0.75,
        f: (x: number) => (5*x**2 + x**3 - 7*x**4) / x,
        expected: 0.9196,
      }
    ];

    const me = 0.001;

    data.forEach(({ x0, f, expected }) => {

      const str = Object
        .entries({ x0, expected, f: f.toString(), me })
        .map(entry => entry.join(': '))
        .join('\n\t- ');

      it(`should aproximate y-intercept for:\n\t- ${str}`, () => {
        const yIntercept = newtonsMethod(f, x0, me);
        expect(yIntercept).to.be.lte(expected + me);
        expect(yIntercept).be.gte(expected - me);
      });
    })
  });
});
