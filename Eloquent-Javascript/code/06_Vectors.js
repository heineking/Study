const { expect } = require("../node_modules/chai");

const curry = (f, arity = f.length, received = []) => {
  return (...args) => {
    const combined = [...received, ...args];
    const argsLeft = arity - combined.length;
    return argsLeft > 0
      ? curry(f, argsLeft, combined)
      : f.apply(null, combined); 
  };
};

const add = (a, b) => a + b;
const addPair = (pair) => add(...pair);
const compose = (...fns) => fns.reduce((a,b) => (...args) => a(b(...args)));
const partial1 = (fn) => (a0) => fn(a0);
const subtract = (a,b) => a - b;
const subtractPair = (pair) => subtract(...pair);
const square = (x) => Math.pow(x, 2);
const squareRoot = (x) => Math.pow(x, 0.5);
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const map = curry((fn, xs) => xs.map(fn));
const reduce = curry((fn, seed, xs) => xs.reduce(fn, seed));
const delta = ([a,b]) => a - b;
const deltas = compose(map(partial1(Math.abs)), map(delta), zip);

const Vec = (a) => ({
  a,
  add(vec) {
    const [dx,dy] = deltas(...vec);
    const [[x0, y0], [x1, y1]] = a;
    return Vec([[x0, y0], [x1+dx, y1+dy]]);
  },
  get length() {
    return compose(
      squareRoot,
      reduce(add, 0),
      map(compose(square, subtractPair)),
      zip
    )(...a);
  },
  toString() {
    return JSON.stringify(a);
  },
  [Symbol.iterator]: function*() {
    yield* a;
  }
});

const vec1 = Vec([[1,1], [2, 2]]);
const vec2 = Vec([[0,0], [1, 1]]);
const vec3 = vec1.add(vec2);

console.log(vec1.length);
console.log(vec3.toString());