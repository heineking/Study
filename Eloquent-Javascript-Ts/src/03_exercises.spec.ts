import { expect } from 'chai';
import { min, isEven, isOdd, countChars } from './03_exercises';

describe('min()', () => {
  it('should return the minimum number', () => {
    expect(min([2, 3, 0, 9, 10])).to.equal(0);
  });
});

describe('isEven()', () => {
  it('should return true if even', () => {
    expect(isEven(12)).to.equal(true);
  });
  it('should return false if odd', () => {
    expect(isEven(11)).to.equal(false);
  });
  it('should handle negative numbers', () => {
    expect(isEven(-10)).to.equal(true);
  })
});

describe('isOdd()', () => {
  it('should return true if odd', () => {
    expect(isOdd(13)).to.equal(true);
  });
  it('should return false if even', () => {
    expect(isOdd(18)).to.equal(false);
  });
  it('should handle negative numbers', () => {
    expect(isOdd(-11)).to.equal(true);
  });
});

describe('countChars()', () => {
  it('should return 2 when counting B in BBC', () => {
    expect(countChars('BBC', 'B')).to.equal(2);
  });
  it('should return 4 when counting k in kakkerlak', () => {
    expect(countChars('kakkerlak', 'k')).to.equal(4);
  });
});
