const R = require("ramda");

{
  // finder value that allows us to define a custom comparator
  function finder(valueFn, bestFn, [head, ...tail]) {
    return R.reduce((best, current) => {
      const [bestValue, currentValue] = [best, current].map(valueFn);
      return (bestValue === bestFn(bestValue, currentValue)) ? best : current;
    }, head, tail);
  }
  // max with our new finder...
  let nums = [1,2,3,10,-1];
  const maxNum = finder(R.identity, R.max, nums);

  // also works for complex object arrays
  let people = [
    { name: "Ringo", age: 65 },
    { name: "John", age: 80 },
    { name: "George", age: 60 }
  ];

  const maxAge = finder(R.prop("age"), R.max, people);
  const sillyCompare = finder(
    R.prop("name"),
    (x,y) => x.charAt(0) === "R" ? x : y,
    people
  );

  // tightening up the finder function
  function best(fn, [head, ...tail]) {
    return R.reduce((x, y) => fn(x, y) ? x : y, head, tail);
  }
  
  const bestMax = best((x, y) => x > y, [1, 2, 3, 4, 5]);

  // repeat

  function simpleRepeat(times, value) {
    return R.map(() => value, R.range(0, times));
  }

  const majorly = simpleRepeat(4, "Major");
  
  // passing in a function allows us to be flexible with what is passed
  // in to the repeater
  function repeat(times, fn) {
    return R.map(fn, R.range(0, times));
  }

  const randNums = repeat(4, () => (Math.floor(Math.random()*10)+1));
  const odelays = repeat(4, () => "Odelay!");

  const elements = repeat(4, n => {
    const id = `id${n}`;
    const p = `<p id="${id}">Odelay!</p>`;
    return id;
  });

  // sometimes it is useful to iteration until a condition is met
  function iterateUntil(fn, check, init) {
    const ret = [];
    let result = fn(init);
    while(check(result)) {
      ret.push(result);
      result = fn(result);
    }
    return ret;
  }

  // iterate until we encounter some "stop" condition. In this case we will iterate
  // until we move past 1024
  const doubles = iterateUntil(n => n*2, n => n <= 1024, 1);

  // this is a nice abstraction because the "repeat" version would require us to
  // know the number of repeats ahead of time
  const repeatedDoubles = repeat(10, exp => Math.pow(2, exp+1));

}

{
  // functions returning functions

  // utilities
  function existy(n) {
    return typeof n !== 'undefined';
  }

  function truthy(x) {
    return x !== false && existy(x);
  }

  function fail(msg) {
    throw new Error(msg);
  }

  function doWhen(cond, action) {
    return cond ? action() : undefined;
  }

  function k(value) {
    return () => value;
  };

  const f = k({ foo: "bar" });
  const isTheSame = f() === f() && f() === f();

  // invoker
  function invoker(name, method) {
    return (target, ...args) => {
      if (!existy(target)) fail("Must provide a target");
      let targetMethod = target[name];
      return doWhen((existy(targetMethod) && method === targetMethod), () => {
        return targetMethod.apply(target, args);
      });
    };
  }

  const rev = invoker('reverse', Array.prototype.reverse);

  const invokedReverse = R.map(rev, [[1,2,3]]);
}

{
  // validator example

  function checker(...validators) {
    return obj => R.reduce(
      (errs, check) => check(obj)
      ? errs
      : errs.concat(check.message),
      [],
      validators
    );
  }

  let alwaysPasses = checker(k(true), k(true));
  let passes = alwaysPasses({});

  let fails = k(false);
  fails.message = "a failure in life";
  let alwaysFails = checker(fails);
  let shouldFail = alwaysFails({});

  // however attaching a '.message' property to the function is kind of a pain
  // and could sometimes wipe an existing value if we are using a validator that
  // we do not own
  function validator(message, fn) {
    const f = (...args) => fn.apply(fn, args);
    f.message = message;
    return f;
  }

  let gonnaFail = checker(validator("ZOMG!", k(false)));
  let gonnaFailMessages = gonnaFail({});

  // some more examples... and some fluency

  function aMap(obj) {
    return !Array.isArray(obj) && obj !== null && typeof obj === 'object';
  }

  function hasKeys(...keys) {
    const f = obj => keys.every(key => Object.keys(obj).includes(key));
    f.message = `Must have values for keys: ${keys.join(', ')}`;
    return f;
  }

  let checkCommand = checker(
    validator("must be a map", aMap),
    hasKeys('msg', 'type')
  );

  let validCommand = checkCommand({ msg: "foo", type: "display" });
  let invalidCommand = checkCommand({});

}