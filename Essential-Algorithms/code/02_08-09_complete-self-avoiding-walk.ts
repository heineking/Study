/*
  In the complete self-avoiding random walk algorithm, what
  is the key backtracking step? In other words, exactly
  where does the backtracking occur?
*/

/*
  The key backtracking steps ocurs in the for-loop that
  recursively calls the extendWalk function. When an
  invalid path is found the method will unwind the points
  added the walk
*/

/*
  When building a complete self-avoiding random walk, what happens if the algorithm
  does not randomize the neighbor list? Would that change the algorithm's performance?

  Answer:

  Randomizing the neighbors is what makes the complete walk "random". Removing the
  randomize would cause the algorithm to produce the same walk for each run. The
  algorithm slows down from randomizing the neighbors because it leads to more
  backtracking.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';
import grid from './lib/walk';

describe(basename, () => {
  const grid1 = grid.createGrid(4, 4);
  const walk = grid1.walk(2, 2);

  it(`should walk all ${grid1.length} points in ${grid1.width}x${grid1.height} grid`, () => {
    expect(walk).to.have.lengthOf(grid1.length);

    const str = `\n    ${grid.walkToString(walk, grid1).replace(/\n/g, '\n    ')}\n`;
    // tslint:disable-next-line: no-console
    console.log(str);
  });
});
