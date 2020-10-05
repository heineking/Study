type Fn = (x: number) => number;

/**
 * Estimates area under xmin and xmax using
 * rectangles.
 * @param fn Function that is being estimated
 * @param xmin left side of area
 * @param xmax right side of are 
 * @param n number of rectangles to use to estimate area
 */
export const rectangleRule = (fn: Fn, xmin: number, xmax: number, n: number): number => {
  // rectangle width
  const dx = (xmax - xmin) / n;

  // add up areas
  let area = 0;
  let x = xmin;

  for (let i = 0; i < n; ++i) {
    area += (dx * fn(x));
    x += dx;
  }

  return area;
};

/**
 * Estimates area under function by using trapezoids.
 * Also known as estimation by line segments
 * @param fn Function that is being integrated
 * @param xmin Left most side of area
 * @param xmax Right most side of area
 * @param n Number of trapezoids to use in estimation
 */
export const trapezoidRule = (fn: Fn, xmin: number, xmax: number, n: number): number => {
  // trapezoid width
  const dx = (xmax - xmin) / n;

  // add up the areas
  let area = 0;
  let x = xmin;

  for (let i = 0; i < n; ++i) {
    area += dx * (fn(x) + fn(x + dx)) / 2;
    x += dx;
  }

  return area;
};
