import { expect } from 'chai';
import { createWorker } from '../worker';

const worker = createWorker();

describe('worker', () => {

  before(() => {
    worker.load(require.resolve('./sum.ts'));
  });

  after(() => {
    worker.kill();
  });

  it('should spin up in a new ts-node process', async () => {
    const { pid } = await worker.ping();
    expect(pid).to.not.equal(process.pid);
  });

  it('should load a file', async () => {
    const result: any = await worker.ping();
    expect(result.file).to.match(/sum\.ts$/);
    expect(result.api).to.eql(['sum', 'default']);
  }); 

  it('should execute function', async () => {
    const result = await worker.exec('sum', 3 /* 1 + 2 + 3 */);
    expect(result).to.equal(6);
  });

  it('should execute default if fname is not specified', async () => {
    const result = await worker.exec(3);
    expect(result).to.equal(6);
  });

  it('should handle multiple calls', async () => {
    const tasks = Promise.all([worker.exec(2), worker.exec(3)]);

    const result3 = await worker.exec(4);
    const [result1, result2] = await tasks;

    expect(result1).to.equal(3);
    expect(result2).to.equal(6);
    expect(result3).to.equal(10);
  });
});