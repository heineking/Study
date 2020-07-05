import { NG } from './prng';

type Delta = -1 | 0 | 1;
type Move = [Delta, Delta];

type Point = { x: number; y: number };
type Size = { w: number; h: number };

const point = (x: number, y: number) => ({ x, y });

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

  return ({ x, y }: Point) => moves.map(([dx, dy]) => point(x + dx, y + dy));

})();

export const createRandomWalk = (prng: NG) => (origin: Point, len: number) => {
  const points = [origin];

  for (let i = 0; i < len; ++i) {
    const current = points.slice(-1)[0];

    const neighbors = getNeighbors(current);

    const index = Math.floor(prng() * neighbors.length);

    points.push(neighbors[index]);
  }

  return points;
};

export const createSelfAvoidingWalk = (prng: NG) => (origin: Point, size: Size) => {
  const points = [origin];

  const hasPoint = (p1: Point) => points.findIndex((p2) => p1.x === p2.x && p1.y === p2.y) > -1;
  const not = (f: (...args: any[]) => boolean) => (...args: any[]) => !f(...args)

  const pointIsInGrid = (p: Point) => (p.x >= 0 && p.x < size.w) && (p.y >= 0 && p.y < size.h);

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
