import { NG } from './prng';

type Delta = -1 | 0 | 1;
type Move = [Delta, Delta];

export type Point = [number, number];
export type Size = { w: number; h: number };

const randomizeArray = <T>(prng: NG, xs: T[]) => {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
};

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

const createPointIsInGrid = ({ w, h }: Size) => {
  const xMin = -(w / 2);
  const xMax = (w / 2);
  const yMin = -(h / 2);
  const yMax = (h / 2);

  return ([x, y]: Point) =>
    (x > xMin && x < xMax) &&
    (y > yMin && y < yMax);
};

const pointIsNotVisited = (points: Point[]) => {
  const visited = ([x1, y1]: Point) => points.findIndex(([x2, y2]) => x1 === x2 && y1 === y2) > -1;
  const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args);

  return (point: Point) => not(visited)(point);
};

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

export const createSelfAvoidingWalk = (prng: NG) => (size: Size) => {
  const origin: Point = [0, 0];
  const points = [origin];

  const pointIsInGrid = createPointIsInGrid(size);

  const getCurrentNeighbors = () =>
    getNeighbors(points.slice(-1)[0])
      .filter(pointIsInGrid)
      .filter(pointIsNotVisited(points));

  let neighbors = getCurrentNeighbors();

  while (neighbors.length !== 0) {
    const index = Math.floor(prng() * neighbors.length);

    points.push(neighbors[index]);

    neighbors = getCurrentNeighbors();
  }

  return points;
};

export const createCompleteSelfAvoidingWalk = (prng: NG) => (size: Size) => {
  const length = (size.w - 1) * (size.h - 1);

  const origin: Point = [0, 0];
  const points: Point[] = [origin];

  const pointIsInGrid = createPointIsInGrid(size);

  const getCurrentNeighbors = () =>
    getNeighbors(points.slice(-1)[0])
      .filter(pointIsInGrid)
      .filter(pointIsNotVisited(points));

  const walk = (): boolean => {
    if (points.length === length) {
      return true;
    }

    const neighbors = getCurrentNeighbors();
    randomizeArray(prng, getCurrentNeighbors());

    if (neighbors.length === 0) {
      return false;
    }

    for (const neighbor of neighbors) {
      points.push(neighbor);
      if (walk()) {
        return true;
      }
      points.pop();
    }

    return false;
  };

  return walk() ? points : [];
};
