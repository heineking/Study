// utilities
const always = x => () => x;
const existy = x => typeof x !== "undefined";
const doWhen = (predicate, action) => predicate ? action() : undefined;

const invoker = (name, method) =>
  (target, ...args) => {
    if (!existy(target)) throw new Error("Must define a target"); 
    const targetMethod = target[name];
    return doWhen(
      (existy(targetMethod) && method === targetMethod),
      () => targetMethod.apply(target, args)
    ); 
  };

const dispatch = (...fns) => 
  (target, ...args) => {
    for(let fn of fns) {
      let ret = fn.apply(fn, [target, ...args]);
      if (existy(ret)) return ret;
    }
    return undefined;
  };

const validator = (message, fn) => {
  const v = (...args) => fn(...args);
  v.message = message;
  return v;
};

const div = (n, d) => n / d;

{

  const str = dispatch(
    invoker("toString", Array.prototype.toString),
    invoker("toString", String.prototype.toString)
  );

  // polymorphic javascript...
  // const abc = str("abc");
  // const numStr = str([1,2,3]);

  // now we can take advantage of the polymorphic contract of dispatch...

  const stringReverse = s =>
    typeof s === "string"
    ? s.split("").reverse().join("")
    : undefined;

  const rev = dispatch(invoker("reverse", Array.prototype.reverse), stringReverse);
  const revAbc = rev("abc");

  // an example of the composability
  const sillyReverse = dispatch(rev, always(42));
  const shouldBe42 = sillyReverse(1000);

}

{
  // execute command with hardcoded switch
  function executeCommand({ type, payload }) {
    let result;
    switch (type) {
      case "notify":
        console.log("notify", payload);
        result = undefined;
        break;
      case "join":
        console.log("joined", payload);
        result = undefined;
        break;
      default:
        console.log("alert", payload);
    }
    return result;
  }

//   executeCommand({ type: "notify", payload: "notification" });
//   executeCommand({ type: "joined", payload: "join room" });
//   executeCommand({ type: "alert", payload: "alert!" });
}

{

  const notify = message => { console.log("notify", message); return 1 };
  const join = message => { console.log("join", message); return 1 };
  const alert = message => { console.log("alert", message); return 1 };

  // higher order execute command
  const isa = (type, action) =>
    obj =>
      type === obj.type
      ? action(obj)
      : undefined;

  const executeCommand = dispatch(
    isa("notify", ({ payload }) => notify(payload)),
    isa("join", ({ payload }) => join(payload)),
    ({ payload }) => alert(payload)
  );

  // executeCommand({ type: "notify", payload: "notification" });
  // executeCommand({ type: "join", payload: "joined room!" });
  // executeCommand({ type: "foo", payload: "bar!" });

  // what is cool about this executeCommand is that it is composable!
  const executeAdminCommand = dispatch(
    isa("kill", ({ payload }) => {
      console.log("kill", payload);
      return 1;
    }),
    executeCommand
  );

  // executeAdminCommand({ type: "kill", payload: "killing process" });
  // executeAdminCommand({ type: "join", payload: "joining room!" });

  // also possible to override behavior...
  const executeTrialUserCommand = dispatch(
    isa("join", ({ payload }) => {
      console.log("Join (trial) " + payload);
      return 1;
    }),
    executeCommand
  );

  // executeTrialUserCommand({ type: "join", payload: "let me join!" });

}

{
  const curry = fn => arg => fn(arg);

  // why would the above be useful?
  // consider...

  const parseIntUncurred = ['11', '11', '11'].map(parseInt);
  //=> [11, NaN, 3]

  const parseIntCurried = ['11', '11', '11'].map(curry(parseInt));
  //=> [11, 11, 11]

  // more currying functions...
  const curry2 = fn => arg2 => arg1 => fn(arg1, arg2);
  const curry3 = fn => arg3 => arg2 => arg1 => fn(arg1, arg2, arg3);


  // some examples
  const div10 = curry2(10);
  div10(50);
  //=> 5

  const parseBinaryString = curry2(parseInt)(2);
  parseBinaryString("111");
  //=> 7
  parseBinaryString("10");
  //=> 2

}

{
  // partial application
  const partial1 = (fn, arg1) => (...args) => fn(arg1, ...args);

  const over10Part1 = partial1(div, 10);
  over10Part1(5);
  //=> 2

  const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2);

  // using partials to enforce preconditions...
  const aMap = obj => !Array.isArray(obj) && obj !== null && typeof obj === 'object';

  const isAMap = validator("arg must be a map", aMap)(42);

  const identity = n => n;
  const complement = (fn) => (...args) => !fn(...args);
  const zero = validator("cannot be zero", n => n === 0);
  const number = validator("arg must be a number", n => typeof n === "number");
  const isEven = n => n%2 === 0;

  const sqr = n => {
    if (!number(n)) throw new Error(number.message);
    if (zero(n)) throw new Error(zero.message);

    return n * n;
  };

  sqr(10);

  // sqr(0);
  //=> throws Error

  const condition1 = (...validators) => (fn, arg) => {
    const errors = validators.reduce((errors, isValid) =>
      isValid(arg) ? errors : [...errors, isValid.message],
      []
    );

    if (errors.length)
      throw new Error(errors.join(", "));

    return fn(arg);
  };

  // now we can wrap our sqr into a HOF partial with validation
  const sqrPre = condition1(
    validator("arg must not be zero", complement(zero)),
    validator("arg must be a number", number)
  );

  let oneHundred = sqrPre(identity, 10);

  // sqrPre(identity, 0);
  //=> throws error

  // now together with our function
  const checkedSqr = partial(sqrPre, n => n*n);

  oneHundred = checkedSqr(10);
  
  // checkedSqr(0);
  //=> throws error

  // now with the validity separated we can mix in additional checks later...
  const sillySquare = partial(
    condition1(validator("should be even", isEven)),
    checkedSqr
  );

  oneHundred = sillySquare(100);

  sillySquare(11);

  debugger;
}