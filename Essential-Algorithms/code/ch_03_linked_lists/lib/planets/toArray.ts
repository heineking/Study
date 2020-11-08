import { Planet, ThreadName, Threads } from './types';

const toArray = (top: Threads, threadName: ThreadName): Planet[] => {
  const xs: Planet[] = [];
  let curr = top[threadName];
  while (curr) {
    xs.push(curr);
    curr = curr.threads[threadName];
  }
  return xs;
};

export default toArray;
