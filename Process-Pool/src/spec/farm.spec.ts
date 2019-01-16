import { expect } from 'chai';
import Farm from '../Farm';

describe('Farm', () => {
  let farm: Farm = null;
  before(() => {
    farm = new Farm(require.resolve('./sum.ts'));
  });

  after(async () => {
    await farm.end();
  });

  it('should proxy default export of a module', async () => {
    const worker = await farm.acquire();
    const result = await worker(3 /* 1 + 2 + 3 */);
    expect(result).to.equal(6);
  });

  it('should proxy all exports', async () => {
    const worker = await farm.acquire();
    const result = await worker.add2(1, 2);
    expect(result).to.equal(3);
  });
});