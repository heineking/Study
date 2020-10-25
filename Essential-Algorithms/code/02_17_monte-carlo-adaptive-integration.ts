/*
  Could you make a program that uses adaptive Monte Carlo
  integration? Would it be effective?
*/

/*
  It would not be reasonable to use monte carlo integration for
  calculating area for graphs with a known function. A similar
  error percentage as the trapezoid or adaptive quadrature would
  return many more iterations.

  The monte-carlo function took 100,000 iterations to get less
  than 0.5% error.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import monteCarloIntegration from './lib/monteCarloIntegration';

const f = (x: number) => 1 + x + Math.sin(2*x);
const pointIsInShape = (x: number, y: number) => y <= f(x);

describe(basename, () => {
  const data = [
    {
      f,
      pointIsInShape,
      xmin: 0,
      xmax: 5,
      ymin: 0,
      ymax: 6.0548, // https://www.wolframalpha.com/input/?i=1+%2B+x+%2B+sin%282x%29+max+between+0+to+5
      n: 100000,
      trueArea: 18.4195
    },
    {
      f,
      pointIsInShape,
      xmin: 10,
      xmax: 18,
      ymin: 0,
      ymax: 18.621, // https://www.wolframalpha.com/input/?i=1+%2B+x+%2B+sin%282x%29+max+between+10+to+18
      n: 100000,
      trueArea: 120.27
    },
  ];

  data.forEach((args) => {

    it('should calculate area within 0.05% error', () => {
      const area = monteCarloIntegration(args);
      const diff = Math.abs(args.trueArea - area);
      const error = diff / args.trueArea;
      expect(error).to.be.lessThan(0.005);
    });

  });
});
