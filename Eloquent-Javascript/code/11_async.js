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
const delay = (ms = 0) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const delayed = curry((ms, f) => asyncPipe(delay, f)(ms));
const repeatedly = (n, f) => ((n <= 0) ? [] : [...repeatedly(n-1, f), f(n-1)]);
const thunk = (f) => (...args) => f.apply(null, args.slice(0, f.length));
const timeout = (ms) => delayed(ms, () => { throw new Timeout("timeout"); });
const createDelayedQueue = curry((ms, attempts, req) => repeatedly(attempts, (i) => delayed(ms*i, req(i))));

describe("11_async", () => {
  describe("createDelayedQueue", () => {
    it("should execute a queue of functions on a delay", async () => {
      // arrange
      const results = [];
      const attempts = 3;
      const ms = 250;
      const spy = (i) => () => { results.push(Date.now()); };

      // act
      const queue = await Promise.all(createDelayedQueue(ms, attempts, spy));
      const relativeExecutionTimes = results.map((ms, idx, arr) => idx === 0 ? 0 : ms - arr[0]);

      // assert
      expect(relativeExecutionTimes).to.be.length(3);
      
      const [first, second, third] = relativeExecutionTimes;
      expect(first).to.equal(0);
      expect(second).to.be.within(249, 251);
      expect(third).to.be.within(499, 501);
    });
  });
});