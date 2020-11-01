/*
  Write an algorithm that deletes a specified cell from a doubly
  linked list. Draw a picture that shows the process graphically.
*/

/*
          +-------------------------+
        /                            \
       v                              \
    +-----+         +-----+         +-----+
    |     | ---x--> |  x  | ---x--> |     |
    |     | <--x--- |  x  | <--x--- |     |
    +-----+         +-----+         +-----+
       \                               ^
        \                             /
         +---------------------------+

*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import { createList } from './lib/double-link';

describe(basename, () => {

  it('should remove item from list with length 1', () => {
    const list = createList<number>();
    list.insert(0);
    list.remove(list.at(0));
  });

  const data = [0, 1, 2, 3];
  data.forEach((_, index, xs) => {

    const expected = [...xs];
    expected.splice(index, 1);

    it(`should remove item from list ${JSON.stringify(xs)} at index ${index}`, () => {
      const list = createList<number>();
      [...xs].reverse().forEach((x) => list.insert(x));
      list.remove(list.at(index));

      expect(list.toArray()).to.eql(expected);
    });

  });
});
