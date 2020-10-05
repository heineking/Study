import { expect, should } from 'chai';
import { rectangleRule, trapezoidRule } from './integration';

describe('integration estimation', () => {
  const fn = (x: number) => 1 + x + Math.sin(2 * x);

  const rules = [
    {
      name: 'rectangleRule',
      fn: rectangleRule,
      n: 100000,
      error: 0.01,
    },
    {
      name: 'trapezoidRule',
      fn: trapezoidRule,
      n: 100,
      error: 0.01,
    },
  ];

  rules.forEach((rule) => {

    it(`should estimate area for ${fn.toString()} using ${rule.name} within error: ${rule.error}`, () => {
      const area = rule.fn(fn, 0, 5, rule.n);
      const diff = Math.abs(area - 18.419);
      expect(diff).to.be.lessThan(rule.error);
    });

  });
});
