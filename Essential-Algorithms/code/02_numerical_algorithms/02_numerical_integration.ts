import { expect, should } from 'chai';
import { rectangleRule } from './integration';

describe('rectangleRule', () => {
  const fn = (x: number) => 1 + x + Math.sin(2 * x);
  it (`should estimate integratation for ${fn.toString()} within 1%`, () => {
    const area = rectangleRule(fn, 0, 5, 100000);
    const diff = Math.abs(area - 18.419);
    expect(diff).to.be.lessThan(0.01);
  });
});
