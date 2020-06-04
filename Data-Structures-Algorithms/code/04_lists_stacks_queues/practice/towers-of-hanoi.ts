import { Stack } from "../types";
import { ArrayStack } from "../ArrayStack";

type Pole = 'a' | 'b' | 'c';
type Poles = Record<Pole, Stack<number>>;

interface Towers {
  move(src: Pole, dest: Pole): void;
  get(pole: Pole): number[];
}

const createTowers = (n: number): Towers => {

  const poles: Poles = {
    a: ArrayStack<number>(),
    b: ArrayStack<number>(),
    c: ArrayStack<number>()   
  };

  while(n) {
    poles.a = poles.a.push(n);
    n -= 1;
  }

  return {
    move: (src: Pole, dest: Pole) => {
      let [disk, pole] = poles[src].pop()
      poles[src] = pole;

      if (poles[dest].count() > 0 && disk > poles[dest].peek()) {
        throw new Error();
      }

      poles[dest] = poles[dest].push(disk);
    },

    get(pole: Pole): number[] {
      return poles[pole].toArray();
    }
  };
};

const recursive = (n: number): number[] => {

  const towers = createTowers(n);

  const moveTowers = (disk: number, src: Pole, dest: Pole, spare: Pole) => {
    if (disk === 0) {
      towers.move(src, dest);
    } else {
      moveTowers(disk - 1, src, spare, dest);
      towers.move(src, dest);
      moveTowers(disk - 1, spare, dest, src);
    }
  };

  moveTowers(n - 1, 'a', 'b', 'c');
  return towers.get('b');
};

interface Operation {
  dest: Pole;
  disk?: number;
  move?: boolean;
  spare?: Pole;
  src: Pole;
}

const iterative = (n: number): number[] => {
  const towers = createTowers(n);

  const moveTowers = (disk: number, src: Pole, dest: Pole, spare: Pole) => {
    let ops = ArrayStack<Operation>();

    ops = ops.push({ disk, src, dest, spare });

    while (ops.count() > 0) {
      let op!: Operation;
      [op, ops] = ops.pop();

      if (op.move) {
        towers.move(op.src, op.dest);
      } else if (op.disk > 0) {
        // record the operations (reversed)
        ops = ops.push({ disk: op.disk - 1, src: op.spare, dest: op.dest, spare: op.src });
        ops = ops.push({ move: true, src: op.src, dest: op.dest });
        ops = ops.push({ disk: op.disk - 1, src: op.src, dest: op.spare, spare: op.dest });
      }
    }
  };

  moveTowers(n, 'a', 'b', 'c');

  return towers.get('b');
};

const time = (fn: any) => {
  return (...args: any[]) => {
    const start = process.hrtime();
    fn(...args);
    const end = process.hrtime(start);
    return `${end[0]}s ${end[1] / 1000000}ms`;
  };
};

const compare = () => {
  const n = 5;
  return {
    iterate: time(iterative)(n),
    recursive: time(recursive)(n),
  };
};

// console.log(compare());
// => { iterate: '0s 0.596786ms', recursive: '0s 0.115678ms' }

// Interestingly, the recursive implementation is 5x faster than
// the iterative implementation. Algorithm book claims that the
// iterative solution *should* be more efficient... but the node
// javascript engine must be doing some clever optimization that
// cannot be done in the iterative solution.

export default {
  recursive,
  iterative,
};
