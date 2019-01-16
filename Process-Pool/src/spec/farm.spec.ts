import { expect } from 'chai';
import Farm from '../Farm';

describe('Farm', () => {
  let farm: Farm = null;
  before(() => {
    farm = new Farm(require.resolve('./sum.ts'), { maxPool: 1 });
  });

  after(async () => {
    await farm.end();
  });

  it('should proxy default export of a module', async () => {
    const worker = await farm.acquire();
    const result = await worker(3 /* 1 + 2 + 3 */);
    farm.release(worker);
    expect(result).to.equal(6);
  });

  it('should wait until a worker is available', async () => {
    const worker1 = await farm.acquire();
    const task2 = farm.acquire();
    farm.release(worker1);
    const worker2 = await task2;
    expect(worker1).to.equal(worker2);
    farm.release(worker2);
  });

  it('should proxy all exports', async () => {
    const worker = await farm.acquire();
    const result = await worker.add2(1, 2);
    expect(result).to.equal(3);
  });
});