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
const repeatedly = (n, f) => ((n <= 0) ? [] : [...repeatedly(n-1, f), f(n-1)]);
const timeout = (ms) => delayed(ms, () => { throw new Timeout("timeout"); });

const retry = curry((ms, n, req) => new Promise((resolve, reject) => {
  let done = false;
  const requestIfNotDone = () => () => !done ? req() : undefined;
  const queue = [timeout(n*ms), ...createDelayedQueue(ms, n, requestIfNotDone)];

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
      expect(second).to.be.within(245, 255);
      expect(third).to.be.within(495, 505);
    });

  });
  describe("retry", () => {

    it("initiate N retries if retry ms = N-1 x response time", async () => {
      // arrange
      const responseDelay = 100;
      const n = 3;
      const ms = responseDelay / (n-1);

      let calls = 0;
      const noop = () => { };
      const request = () => {
        ++calls;
        return delayed(responseDelay, noop);
      };

      // act
      await retry(ms, n, request);
      
      // assert
      expect(calls).to.equal(n);
    });

    it("should not retry after a successful call is returned", async () => {
      // arrange
      const delayTimes = [100, 0, 100];
      const n = delayTimes.length;
      const requestMade = [false, false, false];
      const successfulRequest = [false, false, false];
      let requestIndex = 0;

      const callback = (requestIndex) => () => {
        successfulRequest[requestIndex] = true;
      };

      const request = () => {
        const index = requestIndex++;
        requestMade[index] = true;
        return delayed(delayTimes.shift(), callback(index));
      };

      // act
      await retry(50, n, request);

      // assert
      expect(requestMade[0]).to.equal(true);
      expect(requestMade[1]).to.equal(true);
      expect(requestMade[2]).to.equal(false);

      expect(successfulRequest[0]).to.equal(false);
      expect(successfulRequest[1]).to.equal(true);
      expect(successfulRequest[2]).to.equal(false);
    });

    it("should throw a timeout error if the retry expires", async () => {
      // arrange
      const request = () => {
        return delay(100);
      };

      // act
      let timeoutError;
      await retry(10, 3, request).catch(err => { timeoutError = (err instanceof Timeout); });

      // assert
      expect(timeoutError).to.equal(true);
    });
  });
});