import randomizeArray from './randomizeArray';

interface Grid {
  readonly width:  number;
  readonly height: number;
  readonly length: number;
  getPoint(x: number, y: number): Point;
  getPointOrDefault(x: number, y: number): Point | null;
  getPoints(): Point[][];
  walk(x: number, y: number): Point[];
}

interface Point {
  readonly x: number;
  readonly y: number;
  neighbors(): Point[];
  toString(): string;
}

type Delta = -1 | 0 | 1;
type Moves = [Delta, Delta][];

const moves: Moves = [
  [-1,  1], // left top
  [-1,  0], // left middle
  [-1, -1], // left bottom
  [ 0, +1], // top
  [ 0, -1], // bottom
  [+1, +1], // right top
  [+1, -1], // right bottom
  [+1,  0], // right middle
];

const createPoint = (x: number, y: number, grid: Grid): Point => {
  return {
    x,
    y,
    neighbors: () => {
      return moves
        .map(([dx, dy]) => grid.getPointOrDefault(x + dx, y + dy))
        .filter((point) => point != null) as Point[];
    },
    toString: () => `(${x},${y})`,
  };
};

const createGrid = (w: number, h: number): Grid => {
  const points: Point[][] = [];

  const grid: Grid = {
    width: w,
    height: h,
    length: w * h,
    getPoint,
    getPointOrDefault,
    getPoints,
    walk,
  };

  // initialize
  for (let y = 0; y < h; ++y) {
    points.push([]);
    for (let x = 0; x < w; ++x) {
      points[y].push(createPoint(x, y, grid));
    }
  }

  // methods

  function getPoint(x: number, y: number): Point {
    if (x >= 0 && x < w && y >= 0 && y < h) {
      return points[y][x];
    };

    throw new Error(`(${x},${y}) is out of bounds`);
  }

  function getPointOrDefault(x: number, y: number): Point | null {
    try {
      return getPoint(x, y);
    } catch {
      return null;
    }
  }

  function getPoints(): Point[][] {
    return points.map((row) => [...row]);
  };

  function walk(x: number, y: number): Point[] {
    const curr = getPoint(x, y);
    const xs: Set<Point> = new Set<Point>([curr]);

    const extendWalk = (point: Point): boolean => {
      if (xs.size === grid.length) {
        return true;
      }

      let neighbors = point.neighbors().filter(pt => !xs.has(pt));

      if (neighbors.length === 0) {
        return false;
      }

      neighbors = randomizeArray(neighbors);

      for (const neighbor of neighbors) {
        xs.add(neighbor);
        if (extendWalk(neighbor)) {
          return true;
        }
        xs.delete(neighbor);
      }

      return false;
    };

    extendWalk(curr);
    return [...xs];
  }

  return grid;
};

const walkToString = (walk: Point[], grid: Grid): string =>  {
  const cellWidth = 2 + `${walk.length}`.length;
  const cellPadding = Array(cellWidth).fill('_').join('');
  const cell = (n: number) => `_${n}${cellPadding}`.slice(0, cellWidth);

  return grid.getPoints()
    .map((row) =>
      row
        .map((point) => cell(walk.indexOf(point)))
        .join('|')
    )
    .join('\n');
};

export default {
  createGrid,
  walkToString,
};
