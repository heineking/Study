import { Planet, ThreadName, Threads } from './types';

const addNext = (threadName: ThreadName, metric: keyof Planet, top: Threads, planet: Planet) => {
  let threads = top;
  let after = threads[threadName];

  while (after && after[metric] < planet[metric]) {
    threads = after.threads;
    after = threads[threadName];
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
