import { expect } from 'chai';
import ArrayList from './ArrayList';
import LinkedList from './LinkedList';

const Lists = [ArrayList, LinkedList];

Lists.forEach((List) => {

  describe('List', () => {

    it('should initialize with empty array', () => {
      const list = List.Of<number>();
      expect(list.toArray()).to.eql([]);
    });

    it('should initialize with passed in values', () => {
      const list = List.Of<number>([0, 1, 2]);
      expect(list.toArray()).to.eql([0, 1, 2]);
    });

    describe('#clear', () => {

      it('should empty the list', () => {
        const list = List.Of<number>([0, 1, 2]);
        list.clear();
        expect(list.toArray()).to.eql([]);
      });

    });

    describe('#at', () => {
      
      it('should throw an error when index is out of bounds', () => {
        const list = List.Of<number>();
        expect(() => list.at(1)).to.throw(RangeError);
      });
    })

    describe('#get', () => {

      it('should return value at index', () => {
        const list = List.Of<number>([0,1,2]);
        expect(list.get(2)).to.equal(2);
      });

      it('should throw an error when trying to get value outside of range', () => {
        const list = List.Of<number>([0]);
        expect(() => list.get(1)).to.throw(RangeError);
      });

    })

    describe('#set', () => {

      it('should set value at index', () => {
        const list = List.Of<number>([0]);
        const value = list.set(0, 1).get(0);
        expect(value).to.equal(1);
      });

      it('should throw error when trying to set value out of bounds', () => {
        const list = List.Of<number>([]);
        expect(() => list.set(0, 0)).to.throw(RangeError);
      })
    });

    describe('#push', () => {

      it('should add item to end of list', () => {
        const list = List.Of<number>();
        list.push(0)
        expect(list.toArray()).to.eql([0]);
      });

    });

    describe('#pop', () => {
      it('should remove item at end of list', () => {
        const list = List.Of<number>([0, 1, 2]);
        const value = list.pop();
        expect(list.toArray()).to.eql([0, 1]);
        expect(value).to.equal(2);
      });

      it ('should return undefined when the list is empty', () => {
        const list = List.Of<number>([]);
        const value = list.pop();
        expect(value).to.be.undefined;
      });
    });

    describe('#insert', () => {

      it('should insert item at current position', () => {
        const list = List.Of<number>();
        list.insert(1);
        expect(list.toArray()).to.eql([1]);
      });

      it('should insert item at current position and shift values', () => {
        const list = List.Of<number>([0,1,2]);
        list.at(1).insert(3);
        expect(list.toArray()).to.eql([0, 3, 1, 2]);
      });

    });

    describe('#remove', () => {

      it('should noop when removing on empty list', () => {
        const list = List.Of<number>();
        list.remove();
        expect(list.count).to.equal(0);
      });

      it('should remove item at current position', () => {
        const list = List.Of<number>([0]);
        list.remove();
        expect(list.toArray()).to.eql([]);
      });

      it('should remove item at current position and shift values', () => {
        const list = List.Of<number>([0, 1, 2]);
        list.at(1).remove();
        expect(list.toArray()).to.eql([0, 2]);
      });
    });

  });
});
