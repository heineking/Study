import { expect } from 'chai';
import hanoi from './towers-of-hanoi';

describe('towers-of-hanoi', () => {
  Object.entries(hanoi).forEach(([fname, f]) => {
    it(`it should work ${fname}`, () => {
      const pole = f(3);
      expect(pole).to.eql([3, 2, 1]);
    });
  });
});