import { expect } from 'chai';
import { ArrayDictionary } from './ArrayDictionary';

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
