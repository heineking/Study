export const rectangleRule = (fn: any, xmin: number, xmax: number, n: number): number => {
  const dx = (xmax - xmin) / n;

  let area = 0;
  let x = xmin;

  for (let i = 0; i < n; ++i) {
    area += (dx * fn(x));
    x += dx;
  }

  return area;
};
