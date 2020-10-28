type F = (x: number) => number;

export const rectangleRule = (f: F, xmin: number, xmax: number, n: number): number => {
  // rectangle width
  const dx = (xmax - xmin) / n;

  // add up areas
  let area = 0;
  let x = xmin;

  for (let i = 0; i < n; ++i) {
    area += (dx * f(x));
    x += dx;
  }

  return area;
};

export default rectangleRule;
