import { expect } from 'chai';
import { createWorker } from '../worker';

const worker = createWorker();

describe('worker', () => {

  after(() => {
    worker.kill();
  });

  it('should spin up in a new ts-node process', async () => {
    const { pid } = await worker.ping();
    expect(pid).to.not.equal(process.pid);
  });

  it('should load a file', async () => {
    const sum = require.resolve('./sum.ts');
    worker.load(sum);
    const result: any = await worker.ping();
    expect(result.file).to.equal(sum);
    expect(result.api).to.eql(['default']);
  });

  it('should execute module', async () => {
    const sum = require.resolve('./sum.ts');
    worker.load(sum);
    const result = await worker.exec('default', 3 /* 1 + 2 + 3 */);
    expect(result).to.equal(6);
  });
});