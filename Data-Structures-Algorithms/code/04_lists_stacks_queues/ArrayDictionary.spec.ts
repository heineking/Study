import { expect } from 'chai';
import ArrayDictionary from './ArrayDictionary';

describe('ArrayDictionary', () => {

  describe('#insert', () => {

    it('should insert item', () => {
      const dict = ArrayDictionary.Of<number, object>();
      dict.insert(1, { foo: 'bar' });
      expect(dict.toArray()).to.eql([[1, { foo: 'bar' }]]);
    });

  });

  describe('#find', () => {
    
    it('should find item by key', () => {
      const dict = ArrayDictionary.Of<number, object>();

      dict.insert(1, { foo: 'foo' });
      dict.insert(0, { bar: 'bar' });

      const item = dict.find(0);
      expect(item).to.eql({ bar: 'bar' });
    });

  });

  describe('#remove', () => {

    it('should remove item by key', () => {
      const dict = ArrayDictionary.Of<number, object>();

      dict.insert(4, { foo: 'foo' });
      dict.insert(0, { bar: 'bar' });
      dict.insert(7, { baz: 'baz' });

      const item = dict.remove(0);
      expect(item).to.eql({ bar: 'bar' });

      const xs = dict.toArray();
      expect(xs).to.deep.include.members([[4, { foo: 'foo' }]]);
      expect(xs).to.deep.include.members([[7, { baz: 'baz' }]]);
    });

    describe('#removeAny', () => {

      it('should remove any item', () => {
        const dict = ArrayDictionary.Of<number, object>();
        dict.insert(0, { foo: 'foo' });
        const item = dict.removeAny();
        expect(item).to.eql({ foo: 'foo' });
        expect(dict.size).to.equal(0);
      });

      it ('should throw an error when empty', () => {
        const dict = ArrayDictionary.Of<number, object>();
        expect(() => dict.removeAny()).to.throw(RangeError);
      });

    });
  });

});
