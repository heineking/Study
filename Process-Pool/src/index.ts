import * as os from 'os';
import Farm from './Farm';
import pi from './pi';

const POINTS_PER_CHILD = 1000000;
const CHILDREN = 500;

// global stuff
const getAverage = (xs: number[]) => {
  return xs.reduce((a, b) => a + b) / estimates.length;
}

// single threaded
console.log('single');
console.time('single');
let estimates: number[] = [];
for(let i = 0; i < CHILDREN; ++i) {
  estimates.push(pi(POINTS_PER_CHILD));
}
console.log(`pi: ${getAverage(estimates)}`);
console.timeEnd('single');
//=> 3.14161
//=> 14677.32ms

// multi-treaded
const cores = os.cpus().length;
const workers = new Farm(require.resolve('./pi.ts'), { maxPool: cores });

console.log('threaded');
console.time('threaded');
const tasks: Array<Promise<number>> = [];

for(let i = 0; i < CHILDREN; ++i) {
  const task = workers
    .acquire()
    .then(worker =>
      worker(POINTS_PER_CHILD)
        .then((result: number) => {
          workers.release(worker);
          return result;
        })
      );
  tasks.push(task);
}

Promise.all(tasks).then((estimates) => {
  console.log(`pi: ${getAverage(estimates)}`);
  console.timeEnd('threaded');
  workers.end(0);
  process.exit(0);
});

/*******************************************
  RESULTS:

  single
  pi: 3.1416392959999992
  single: 11655.172ms

  threaded
  pi: 3.1415866319999983
  threaded: 3895.283ms

  The multi-threaded calculation took 33% of the time
  as the single threaded calculation. This multi-threaded
  approach could be improved further by warming up the
  farm. It takes about ~500ms to spin up a new node.js
  process which is done within the calculation.
*/