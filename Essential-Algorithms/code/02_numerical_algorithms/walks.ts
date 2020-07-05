import { NG } from './prng';

type Delta = -1 | 0 | 1;
type Move = [Delta, Delta];

export type Point = [number, number];
export type Size = { w: number; h: number };

const getNeighbors = (() => {

  const moves: Move[] = [
    [-1,  1], // left top
    [-1,  0], // left middle
    [-1, -1], // left bottom
    [ 0, +1], // top
    [ 0, -1], // bottom
    [+1, +1], // right top
    [+1, -1], // right bottom
    [+1,  0], // right middle
  ];

  return ([x, y]: Point) => moves.map(([dx, dy]): Point => [x + dx, y + dy]);

})();

export const createRandomWalk = (prng: NG) => (len: number) => {
  const origin: Point = [0, 0];
  const points = [origin];

  for (let i = 1; i < len; ++i) {
    const current = points.slice(-1)[0];

    const neighbors = getNeighbors(current);

    const index = Math.floor(prng() * neighbors.length);

    points.push(neighbors[index]);
  }

  return points;
};

export const createSelfAvoidingWalk = (prng: NG) => ({ w, h }: Size) => {
  const xMin = -(w / 2);
  const xMax = (w / 2);
  const yMin = -(h / 2);
  const yMax = (h / 2);

  const origin: Point = [0, 0];
  const points = [origin];

  const hasPoint = ([x1, y1]: Point) => points.findIndex(([x2, y2]) => x1 === x2 && y1 === y2) > -1;
  const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args)

  const pointIsInGrid = ([x, y]: Point) =>
    (x >= xMin && x < xMax) &&
    (y >= yMin && y < yMax);

  const getCurrentNeighbors = () =>
    getNeighbors(points.slice(-1)[0])
      .filter(pointIsInGrid)
      .filter(not(hasPoint))

  let neighbors = getCurrentNeighbors();

  while (neighbors.length !== 0) {
    const index = Math.floor(prng() * neighbors.length);

    points.push(neighbors[index]);

    neighbors = getCurrentNeighbors();
  }

  return points;
};
