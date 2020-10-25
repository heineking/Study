type F = (x: number) => number;
export const rectangleMidpointRule = (f: F, xmin: number, xmax: number, n: number) => {
  const dx = (xmax - xmin) / n;
  let area = 0;
  let x = xmin + (dx / 2);
  for (let i = 0; i < n; ++i) {
    area += dx * f(x);
    x += dx;
  }
  return area;
};

export default rectangleMidpointRule;
