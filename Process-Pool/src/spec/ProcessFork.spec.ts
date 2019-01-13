import { expect } from 'chai';
import ProcessFork from '../ProcessFork';

describe('ProcessFork', () => {
  let sum: ProcessFork;

  beforeEach(() => {
    sum = new ProcessFork(require.resolve('./sum.js'), { maxPools: 1 });
  });

  afterEach(() => {
    sum.kill();
  });

  it('should instantiate', () => {
    expect(sum).to.be.instanceOf(ProcessFork);
  });

  it('should run', async () => {
    const result = await sum.run(3); // 1 + 2 + 3
    expect(result).to.equal(6);
  });
  it('should run multiple requests', async () => {
    const tasks = [
      1,  // 1
      2,  // 3
      3,  // 6 
      4,  // 10
      5,  // 15
    ].map((n) => sum.run(n));
    const results = await Promise.all(tasks);
    expect(results).to.eql([1, 3, 6, 10, 15]);
  });
  it('should run long running requests', async () => {
    const sum = new ProcessFork(require.resolve('./sum.js'), { maxPools: 4 });
    const n = 1e9;
    const xs = [n, n, n, n];
    const tasks = xs.map((n) => sum.run(n));
    const results = await Promise.all(tasks);
    const areAllTheSame = results.every((result, index, xs) => {
      if (index > 0) {
        return xs[index - 1] == result;
      }
      return true;
    });
    expect(areAllTheSame).to.equal(true);
    sum.kill()
  });

  it('should reject process if error is raised', async () => {
    const error = new ProcessFork(require.resolve('./error.js'), { maxPools: 1 });   
    const task = error.run('').catch((error) => {
      expect(error).to.be.instanceOf(Error);
    });
    await task;
    error.kill();
  });
});