// lazy chaining
// this is useful for APIs around the use of objects. It might not be all that 
// great of an approach with functional APIs

class LazyChain {
  constructor(target) {
    this._target = target;
    this._calls = [];
  }
  invoke(methodName, ...args) {
    this._calls.push(target => {
      let method = target[methodName];
      return method.apply(target, args);
    });
    return this;
  }
  tap(f) {
    this._calls.push(target => {
      f(target);
      return target;
    });
    return this;
  }
  run() {
    return this._calls.reduce((target, thunk) => thunk(target), this._target);
  }
}

new LazyChain([2,1,3]).invoke('sort')._calls;
//=> [function(target) {...}]

/*
 The wrapped function is a 'thunk.' A thunk is a function that has wrapped some
 behavior and is waiting to be called.
*/

let lazySort = new LazyChain([2,1,3]).invoke('sort');
let lazilySorted = lazySort.run();
//=> [1,2,3]

let lazier = new LazyChain([2,1,3])
  .invoke('concat', [8,5,7,6])
  .invoke('sort')
  .invoke('join', ' ');

let lazierResult = lazier.run();
//=> '1 2 3 4 5 6 7 8'

let revealingLazy = new LazyChain([2, 1, 3])
  .invoke('sort')
  // .tap(o => console.log(o)) //<= outputs to console.log
  .invoke('join', ' ')
  .run();

/*
  The lazy chain is challenging because it is is mutating a shared reference with
  each chained function. A better approach would be to use the pipe(...) which will
  pass foward the pipeline
*/

const pipe = (...fns) => fns.reduce((a,b) => (...args) => b(a(...args)));
const shouldBe8 = pipe(n => n+1, n => n*2)(3);
//=> 8

// some examples of using and composing with pipe(...)
const rest = ([head, ...tail]) => tail;
const first = ([head]) => head;

const fifth = pipe(
  rest,
  rest,
  rest,
  rest,
  first
);

let ex1 = fifth([1,2,3,4,5]);
//=> 5

const negativeFifth = pipe(fifth, n => -n);
const ex2 = negativeFifth([1,2,3,4,5]);
//=> -5

debugger;