/*
  When you use the rectangle rule, parts of some rectangles
  fall above the curve, increasing the estimated area, and
  parts of some rectangles fall below the curve, reducing
  the estimated area. What do you think would happen if you
  used the function's value at the midpoint of the rectangle
  for the rectangle's height instead of the function's value
  at the rectangle's left edge?

  Write a program to check your hypothesis.
*/

/*
  I think that taking the function's value from the midpoint
  will increase the accuracy of the function.
*/

const basename = __filename.split('/').slice(-1)[0];
import { expect } from 'chai';

import rectangleRule from './lib/rectangleRule';
import rectangleMidPointRule from './lib/rectangleMidPointRule';

const f = (x: number) => 1 + x + Math.sin(2*x);

describe(basename, () => {
  const data = [
    [0, 5, 20, 18.4195],
    [10, 18, 20, 120.27]
  ];

  data.forEach(([xmin, xmax, n, trueArea]) => {

    it(`should return better accuracy for midpoint rule given: \n\txmin: ${xmin}\n\txmax: ${xmax}\n\tn: ${n}`, () => {
      const area1 = rectangleRule(f, xmin, xmax, n);
      const err1 = Math.abs(trueArea - area1) / trueArea;

      const area2 = rectangleMidPointRule(f, xmin, xmax, n);
      const err2 = Math.abs(trueArea - area2) / trueArea;

      expect(err2).to.be.lessThan(err1);
    });

  });
});
