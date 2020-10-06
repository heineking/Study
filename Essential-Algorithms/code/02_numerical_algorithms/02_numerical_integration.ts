import { expect, should } from 'chai';
import { rectangleMidpointRule, rectangleRule, trapezoidRule } from './integration';

describe('integration estimation', () => {
  const f = (x: number) => 1 + x + Math.sin(2 * x);
  const actual = 18.419;

  const rules = [
    {
      name: 'rectangleRule',
      g: rectangleRule,
      n: 100000,
      error: 0.01,
    },
    {
      name: 'rectangeMidpointRule',
      g: rectangleMidpointRule,
      n: 1000,
      error: 0.01,
    },
    {
      name: 'trapezoidRule',
      g: trapezoidRule,
      n: 100,
      error: 0.01,
    },
  ];

  rules.forEach((rule) => {
    const { name, g, error, n } = rule;

    it(`should estimate area for ${f.toString()} using ${name} within error: ${error} when n = ${n}`, () => {
      const area = g(f, 0, 5, n);
      const diff = Math.abs(area - actual);
      expect(diff).to.be.lessThan(rule.error);
    });

  });

});
