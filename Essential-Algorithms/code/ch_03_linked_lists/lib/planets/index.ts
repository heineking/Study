import { Planet, Threads, PlanetList, ThreadName } from './types';
import { planets } from './planets';
import add from './add';
import toArray from './toArray';

const createPlanetList = (): PlanetList => {
  const top: Threads = {};

  const list = {
    add: (planet: Planet) => add(top, planet),
    toArray: (thread: ThreadName) => toArray(top, thread),
  };

  // initialize
  planets.forEach(list.add);

  // return the list
  return list;
};

export { createPlanetList };
