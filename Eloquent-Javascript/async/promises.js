class Timeout extends Error { };

const curry = (f, arity = f.length, received = []) => {
 return (...args) => {
    const combined = [...received, ...args];
    const left = arity - combined.length;
    return left > 0
      ? curry(f, left, combined)
      : f.apply(null, combined);
  };
};

const k = (v) => () => v;
const compose = (...fs) => fs.reduce((a, b) => (...args) => a(b(...args)));
const delay = (ms = 0) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const delayed = curry((ms, f) => delay(ms).then(_ => f()));
const tap = curry((g, f) => (...args) => { g(...args); return f(...args); });
const timeout = (ms) => delay(ms).then(_ => { throw new Timeout("timeout"); });
const repeatedly = (n, f) => ((n <= 0) ? [] : [f(n), ...repeatedly(n-1, f)]);
const doWhen = (pred, f) => () => pred() ? f() : undefined;

const retryOnTimeout = curry((ms, n, req) => {
  let done = false;
  const delayedRequest = i => delayed((i-1)*ms, doWhen(() => !done, req));
  return new Promise((resolve, reject) => {
    const queue = [timeout(n*ms, req), ...repeatedly(n, delayedRequest)];
    Promise.race(queue)
      .then(resolve)
      .catch(reject)
      .finally(() => done = true);
  });
});

const getMessage = (ms) => () => new Promise((resolve) => setTimeout(() => resolve("hello, world"), ms));
const retryEverySecond = retryOnTimeout(500, 3);
const withRetry = (req) => retryEverySecond(req).then(console.log).catch(console.log);


withRetry(tap(() => console.log("called once"), getMessage(250)));
withRetry(tap(() => console.log("called three, then timeout"), getMessage(4000)));