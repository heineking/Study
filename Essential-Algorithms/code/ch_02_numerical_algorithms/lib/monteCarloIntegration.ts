type PointIsInShape = (x: number, y: number) => boolean;

interface Args {
  pointIsInShape: PointIsInShape;
  n: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

const random = (min: number, max: number) => (Math.random() *  (max - min)) + min;

const monteCarloIntegration = (args: Args) => {
  const {
    pointIsInShape,
    n,
    xmin,
    xmax,
    ymin,
    ymax
  } = args;

  let hits = 0;

  for (let i = 0; i < n; ++i) {
    const x = random(xmin, xmax);
    const y = random(ymin, ymax);
    if (pointIsInShape(x, y)) {
      hits += 1;
    }
  }

  const totalVolume = (ymax - ymin) * (xmax - xmin);
  const hitFraction = hits / n;

  return totalVolume *  hitFraction;
};

export default monteCarloIntegration;
