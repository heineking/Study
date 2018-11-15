import { expect } from 'chai';
import { getCharFrequencies } from './index';

describe('test suite', () => {
  it('should have a working test suite', () => {
    expect(true).to.equal(true);
  });
});

describe('getCharFrequencies()', () => {
  it('should count character frequencies', () => {
    const xs = 'foo'.split('');
    expect(getCharFrequencies(xs)).to.eql({ f: 1, o: 2 });
  });
});
