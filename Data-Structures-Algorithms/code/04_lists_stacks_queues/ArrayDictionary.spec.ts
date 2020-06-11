import { expect } from 'chai';
import { ArrayDictionary, binarySearch } from './ArrayDictionary';
import { ArrayList } from './ArrayList';
import { KeyValuePair, Compare } from './types';

describe('ArrayDictionary', () => {

  describe('#insert', () => {

    it('should insert item', () => {
      let dict = ArrayDictionary<number, object>();
      dict = dict.insert(1, { foo: 'bar' });
      expect(dict.toArray()).to.eql([[1, { foo: 'bar' }]]);
    });

  });

  describe('#find', () => {
    
    it('should find item by key', () => {
      let dict = ArrayDictionary<number, object>();

      dict = dict.insert(1, { foo: 'foo' });
      dict = dict.insert(0, { bar: 'bar' });

      const [item] = dict.find(0) || [];
      expect(item).to.eql({ bar: 'bar' });
    });

  });

  describe('#remove', () => {

    it('should remove item by key', () => {
      let dict = ArrayDictionary<number, object>();

      dict = dict.insert(4, { foo: 'foo' });
      dict = dict.insert(0, { bar: 'bar' });
      dict = dict.insert(7, { baz: 'baz' });

      const [item] = dict.remove(0) || [];
      expect(item).to.eql({ bar: 'bar' });

      const xs = dict.toArray();
      expect(xs).to.deep.include.members([[4, { foo: 'foo' }]]);
      expect(xs).to.deep.include.members([[7, { baz: 'baz' }]]);
    });

  });

  describe('#removeAny', () => {

    it('should remove any item', () => {
      let dict = ArrayDictionary<number, object>();
      dict = dict.insert(0, { foo: 'foo' });

      let item!: object;
      [item, dict] = dict.removeAny();

      expect(item).to.eql({ foo: 'foo' });
      expect(dict.size()).to.equal(0);
    });

  });
});

describe('binarySearch', () => {

  it('should find item by key with 1 item in array', () => {
    // arrange
    let xs = ArrayList<KeyValuePair<number, string>>();
    xs = xs.append({ key: 1, value: 'foo' });

    const cmp: Compare<number> = {
      lt: (a, b) => a < b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
    };

    // act
    const result = binarySearch(cmp, xs, 1);

    // assert
    expect(result).to.eql('foo');
  });

  it('should find item by key with 2 items in array', () => {
    let xs = ArrayList<KeyValuePair<number, string>>();
    xs = xs.append({ key: 1, value: 'foo' }).append({ key: 2, value: 'bar' });

    const cmp: Compare<number> = {
      lt: (a, b) => a < b,
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
    };

    // act
    const foo = binarySearch(cmp, xs, 1);
    const bar = binarySearch(cmp, xs, 2);

    // assert
    expect(foo).to.eql('foo');
    expect(bar).to.eql('bar');
  });

  it('should find item by key by successively halving search area', () => {

    let xs = ArrayList<KeyValuePair<number, string>>();
    for (let i = 0; i < 1000; ++i) {
      xs = xs.append({ key: i, value: `${i}` });
    }

    let count = 0;
    const cmp: Compare<number> = {
      lt: (a, b) => {
        count += 1;
        return a < b;
      },
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
    };   

    const result = binarySearch(cmp, xs, 999);
    expect(result).to.equal('999');
    expect(count).to.be.lessThan(1000);
  });
});
