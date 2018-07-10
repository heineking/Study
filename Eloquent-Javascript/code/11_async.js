const { expect } = require("../node_modules/chai");

class Timeout extends Error { };

const curry = (f, arity = f.length, received = []) => {
  return (...args) => {
    const combined = [...received, ...args];
    const argsLeft = arity - combined.length;
    return argsLeft > 0
      ? curry(f, argsLeft, combined)
      : f.apply(null, combined);
  };
};

const asyncCompose = (...fns) => fns.reduce((a,b) => async (...args) => a(await(b(...args))));
const asyncPipe = (...fns) => fns.reduce((a,b) => async (...args) => b(await a(...args)));
const createDelayedQueue = curry((ms, attempts, fn) => repeatedly(attempts, (i) => delayed(ms*i, fn(i))));
const delay = (ms = 0) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const delayed = curry((ms, f) => asyncPipe(delay, f)(ms));
const doWhen = curry((pred, fn) => pred() ? fn() : undefined);
const repeatedly = (n, f) => ((n <= 0) ? [] : [...repeatedly(n-1, f), f(n-1)]);
const thunk = (f) => (...args) => f.apply(null, args.slice(0, f.length));
const timeout = (ms) => delayed(ms, () => { throw new Timeout("timeout"); });

const retry = curry((ms, n, req) => new Promise((resolve, reject) => {
  let done = false;
  const ifNotDone = doWhen(() => !done);
  const queue = [timeout(n*ms), ...createDelayedQueue(ms, n, () => () => !done ? req() : undefined)];
  Promise
    .race(queue)
    .then(resolve)
    .catch(reject)
    .finally(() => done = true);
}));

describe("11_async", () => {
  describe("createDelayedQueue", () => {
    it("should execute a queue of functions on a delay", async () => {
      // arrange
      const results = [0,0,0];
      const attempts = 3;
      const ms = 250;
      const spy = (i) => () => { results[i] = Date.now(); };

      // act
      await Promise.all(createDelayedQueue(ms, attempts, spy));
      const relativeExecutionTimes = results.map((ms, idx, arr) => idx === 0 ? 0 : ms - arr[0]);

      // assert
      expect(relativeExecutionTimes).to.be.length(3);
      
      const [first, second, third] = relativeExecutionTimes;
      expect(first).to.equal(0);
      expect(second).to.be.within(248, 252);
      expect(third).to.be.within(492, 502);
    });
  });
  describe("retry", () => {
    it("should make all the calls in the queue successful", async () => {
      // arrange
      let calls = 0;
      const noop = () => { };
      const request = () => {
        ++calls;
        return delayed(100, noop);
      };

      // act
      await retry(50, 3, request);
      
      // assert
      expect(calls).to.equal(3);
    });
  });
});