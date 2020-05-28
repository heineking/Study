import { expect } from 'chai';
import { ArrayList } from './ArrayList';
import { LinkedList } from './LinkedList';

describe('LinkedList', () => {

  it('should initialize as empty', () => {
    const list = LinkedList<number>();
    expect(list.toArray()).to.eql([]);
  });
  
  describe('#insert', () => {
    
    it('should insert item', () => {
      let list = LinkedList<number>();
      list = list.insert(0);
      expect(list.toArray()).to.eql([0]);
    });

    it('should shift items', () => {
      let list = LinkedList<number>();
      list = list.insert(0).insert(1);
      expect(list.toArray()).to.eql([1, 0]);
    });

  });

  describe('#append', () => {

    it('should add item to end of list', () => {
      let list = LinkedList<number>();
      list = list.append(0).append(1);
      expect(list.toArray()).to.eql([0, 1]);
    });

  });

  describe('#remove', () => {

    it('should remove item from list', () => {
      let list = LinkedList<number>();
      list = list.append(0).append(1);
      let item!: number;
      [item, list] = list.remove();
      expect(list.toArray()).to.eql([1]);
      expect(item).to.eql(0);
    });

  });

  describe('#set', () => {

    it('should set item at index', () => {
      let list = LinkedList<number>().append(0);
      list = list.at(0).set(1);
      expect(list.toArray()).to.eql([1]);
    });

    it('should set item at arbitrary index', () => {
      let list = LinkedList<number>().append(0).append(1).append(2);
      list = list.at(1).set(10);
      expect(list.toArray()).to.eql([0, 10, 2]);
    });
  });
});


describe('ArrayList', () => {

  describe('#insert', () => {

    it('should insert item', () => {
      let xs = ArrayList<number>();
      xs = xs.insert(0);
      expect(xs.toArray()).to.eql([0]);
    });

    it('should shift items', () => {
      let xs = ArrayList<number>();
      xs = xs.insert(0).insert(1);
      expect(xs.toArray()).to.eql([1, 0]);
    });
  });

  describe('#append', () => {

    it('should add items to end of array', () => {
      let xs = ArrayList<number>();
      xs = xs.append(0).append(1);
      expect(xs.toArray()).to.eql([0, 1]);
    });

  });

  describe('#remove', () => {

    it('should remove item', () => {
      let xs = ArrayList<number>().append(0).append(1);
      let item!: number;
      [item, xs] = xs.remove();
      expect(item).to.equal(0);
      expect(xs.toArray()).to.eql([1]);
    });

  });

  describe('#value', () => {

    it('should return item at current position', () => {
      const xs = ArrayList<number>().append(0).append(1);
      const item = xs.value();
      expect(item).to.equal(0);
    });

  });
});
