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

/*
  Let's use this new utility to create a functional API for our table data example
  from chapter 2 
*/

function curryN(length, received, fn) {
  return (...args) => {
    const combined = [...received, ...args];
    const left = length - combined.length;
    return left <= 0
      ? fn.apply(this, combined)
      : curryN(length, combined, fn);
  }
}

function curry(fn) {
 return curryN(fn.length, [], fn);
}

//:: [string] -> object -> object
const pick = curry((xs, obj) =>
  Object.keys(obj)
    .reduce((acc, key) =>
      xs.includes(key)
      ? Object.assign(acc, { [key]: obj[key] })
      : acc,
      {}
    )
  );

//:: [string] -> object -> object
const omit = curry((xs, obj) =>
  Object.keys(obj)
    .filter(key => !xs.includes(key))
    .reduce((acc, key) =>
      Object.assign(acc, { [key]: obj[key]}),
      {}
    )
  );

//:: [object] -> object -> object
const rename = curry((renames, obj) =>
  Object.keys(obj)
    .reduce((acc, key) =>
      renames[key]
      ? Object.assign(acc, { [renames[key]]: obj[key] })
      : acc,
      omit(Object.keys(renames), obj)
    )
  );

//:: [string] -> [object] -> [object]
const project = curry((xs, table) => table.map(row => pick(xs, row)));

//:: object -> [object] -> [object]
const columnAs = curry((x, table) => table.map(row => rename(x, row)));

//:: (a -> boolean) -> a -> [a]
const where = curry((pred, xs) => xs.filter(pred));

//:: [string] -> [object] -> [b]
const pluck = curry((x, ys) => ys.map(y => y[x]));

// examples
const book = (title, isbn, ed, pages) => ({ isbn, title, ed, pages });

const table = [
  book('Don Quixote', '123-457-890', 1, 300),
  book('Hamlet', '444-222-111', 2, 200),
  book('Moby Dick', '777-282-999', 5, 600)
];

const getFirstEditions = pipe(
  columnAs({ ed: 'edition' }),
  project(['title', 'edition', 'isbn']),
  where(book => book.edition === 1)
);

const getBooksLongerThanPage = n => pipe(
  project(['title', 'pages', 'ed']),
  where(book => book.pages > n)
)

const firstEds = getFirstEditions(table);
//=> Don Quixote

const over200 = getBooksLongerThanPage(200);
const booksOver200 = over200(table);
//=> Don Quixote, Moby Dick

const findOver200AndFirstEds = pipe(
  over200,
  getFirstEditions,
  pluck('title')
);

const firstEdsOver200 = findOver200AndFirstEds(table);
//=> Don Quixote

/*
  Both of the above examples relied on the fact that the data being returned was
  stable. For example, LazyChain always expected another LazyChain to be returned,
  or in pipe that the types were respected.

  What if we need to interact with something that is not guaranteed to be stable?

  Answer: actions & lazy chain.

  Taken from: Stan 2011
  http://igstan.ro/posts/2011-05-02-understanding-monads-with-javascript.html
*/
const last = xs => xs.slice(-1).pop();
const existy = x => typeof x !== 'undefined';

const actions = (...args) => seed => {
  const actions = args.slice(0, args.length - 1); 
  const done = last(args);
  const init = { values: [], state: seed };
  const { values, state } = actions.reduce((stateObj, action) => {
    const result = action(stateObj.state);
    const values = stateObj.values.concat(result.answer);
    return {
      values,
      state: result.state
    };
  }, init);
  const keep = values.filter(existy);
  return done(keep, state);
};

const sqr = n => n*n;

const mSqr = state => {
  var ans = sqr(state);
  return { answer: ans, state: ans };
};

const doubleSquareAction = actions(mSqr, mSqr, values => values);
const doubleAns = doubleSquareAction(10);
//=> [100, 1000]

const note = (args) => { console.log(args); };
const mNote = state => {
  note(state);
  return { answer: undefined, state: state };
};

const neg = n => -n;
const mNeg = state => ({ answer: -state, state: -state });

const negativeSqrAction = actions(mSqr, mNote, mNeg,
  (_, state) => state
);

const negativeSqrActionResult = negativeSqrAction(9);
// Note: 81
//=> -81

/*
  Constructing all of those mXX function can get a bit annoying. We can abstract
  away the management of the state container with `lift`
*/

const lift = (answerFn, stateFn) => (...args) => state => {
  const ans = answerFn.apply(null, [state, ...args]);
  const nextState = stateFn ? stateFn(state) : ans;
  return { answer: ans, state: nextState };
};

const mSqr2 = lift(sqr);
const mNote2 = lift(note, identity => identity);
const mNeg2 = lift(neg);

const negativeSqrAction2 = actions(mSqr2(), mNote2(), mNeg2(), (_, state) => state);
const negativeSqrActionResult2 = negativeSqrAction2(9);
// NOTE: 81
//=> -81


// now with this I can create some interesting behaviors...
var push = lift((stack, e) => [e, ...stack]);
var pop = lift(([head]) => head, ([head, ...tail]) => tail);

var stackAction = actions(
  push(1),
  push(2),
  pop(),
  (values, state) => state
);

const stackActionResult = stackAction([]);

// the essence of a the stack is captured in a series of actions and stored in the
// `stackAction` variable. Only when we call it will the stack be realized. Now
// we can do neat stuff with composition around the stack action