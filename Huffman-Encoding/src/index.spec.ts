import { expect } from 'chai';
import { getCharFrequencies, createTree, invertTree, encode } from './index';

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

describe('createTree()', () => {
  it('should create a tree from frequency table', () => {
    const freq = getCharFrequencies('foo'.split(''));
    expect(createTree(Object.entries(freq))).to.eql({'0': 'f', '1': 'o'});
  });
});

describe('invertTree()', () => {
  it('should invert the encoding tree', () => {
    const freq = getCharFrequencies('foo'.split(''));
    const tree = createTree(Object.entries(freq));
    expect(invertTree(tree)).to.eql({ 'f': '0', 'o': '1' });
  });
});

describe('encode()', () => {
  it('should encode a string', () => {
    expect(encode('foo')).to.equal('011');
  });
});
