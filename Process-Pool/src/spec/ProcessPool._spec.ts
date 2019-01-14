import { expect } from 'chai';
import ProcessPool from '../ProcessPool';

describe('ProcessPool', () => {
  let processPool: ProcessPool;

  beforeEach(() => {
    processPool = new ProcessPool(require.resolve('./sum.js'), { maxPools: 1 });
  });

  afterEach(() => {
    processPool.kill();
  });

  it('should instantiate', () => {
    expect(processPool).to.be.instanceOf(ProcessPool);
  });

  it('should kill processes', async () => {
    const processPool = new ProcessPool(require.resolve('./sum.js'));
    
    const p1 = await processPool.acquire();
    const p2 = await processPool.acquire();

    processPool.kill();

    expect(p1.killed).to.equal(true);
    expect(p2.killed).to.equal(true);
  });

  it('should acquire a process', async () => {
    const process = await processPool.acquire();
    expect(process.constructor).to.have.property('name', 'ChildProcess');
  });

  it('should await until a process is free if maxPools are active', async () => {
    const process1 = await processPool.acquire();
    const process2Task = processPool.acquire();

    // simulate some async work...
    setTimeout(() => {
      processPool.release(process1);
    }, 0);

    const process2 = await process2Task;

    expect(processPool.count).to.equal(1);
    expect(process1.pid).to.equal(process2.pid);
  });

  it('should put process in idle if no process is waiting', async () => {
    const process = await processPool.acquire();
    processPool.release(process);
    const nextProcess = await processPool.acquire();
    expect(process.pid).to.equal(nextProcess.pid);
  });

  it('should reject all waiting acquires if pool is killed', async () => {
    await processPool.acquire();
    const rejected = processPool.acquire().catch((err) => {
      expect(err).to.be.instanceOf(Error);
    });
    processPool.kill();
    await rejected;
  });
});