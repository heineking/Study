import { Planet, ThreadName, Threads } from './types';

const addNext = (threadName: ThreadName, metric: keyof Planet, top: Threads, planet: Planet) => {
  let threads = top;
  let next = threads[threadName];

  while (next && next[metric] < planet[metric]) {
    threads = next.threads;
    next = threads[threadName];
  }

  planet.threads[threadName] = threads[threadName];
  threads[threadName] = planet;
};

const add = (top: Threads, planet: Planet) => {
  addNext(ThreadName.NextDiameter, 'diameter', top, planet);
  addNext(ThreadName.NextDistance, 'distanceToSun', top, planet);
  addNext(ThreadName.NextMass, 'mass', top, planet);
};

export default add;
