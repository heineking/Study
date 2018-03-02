// Recursion
{
  // some simple self recursion examples...

  function myLength([head, ...tail]) {
    if (!head) return 0
    return 1 + myLength(tail);
  }
  let len = myLength([1,2,3]);

  function cycle(times, ary) {
    if (times <= 0) return [];
    return [...ary, ...cycle(times - 1, ary)]
  }

  let cycled = cycle(2, [1,2,3]);
 
  // construct a recursive function to undo a zip...
  const zip = (xs1, xs2) => xs1.map((x1, i) => [x1, xs2[i]]);

  const constructPair = ([x, y], [xs, ys]) => {
    return [[x, ...xs], [y, ...ys]];
  }

  const unzip = ([head, ...tail]) => {
    if (!head) return [[],[]];
    return constructPair(head, unzip(tail));
  }

  const undid = unzip(zip([1,2,3], ['a', 'b', 'c']));
}

{
  // graph walking.. simple with recursion!
  
  // a graph of language influences where the laguage on the left influenced
  // the language on the right
  const influences = [
    ['Lisp', 'Smalltalk'],
    ['Lisp', 'Scheme'],
    ['Smalltalk', 'Self'],
    ['Scheme', 'Javascript'],
    ['Scheme', 'Lua'],
    ['Self', 'Lua'],
    ['Self', 'Javascript']
  ];

  const children = ([head, ...tail], node) => {
    if (!head) return [];
    const [l, r] = head;
    if (l === node) {
      return [r, ...children(tail, node)];
    }
    return children(tail, node);
  };

  const lispChildren = children(influences, 'Lisp');
  //=> ['Smalltalk', 'Scheme'j]

  // depthSearch (keeps looking left)
  const rev = ([head, ...tail]) => {
    if (!head) return [];
    return [...rev(tail), head];
  };
  const includes = (xs, x) => xs.includes(x);

  const depthSearch = (graph, [head, ...tail], seen = []) => {
    if (!head) return rev(seen);
    if (includes(seen, head)) {
      return depthSearch(graph, tail, seen);
    }
    return depthSearch(
      graph,
      [...children(graph, head), ...tail],
      [head, ...seen]
    );
  };
  const allInfluencedByLisp = depthSearch(influences, ['Lisp']);

  // these are some examples of tail call javascript calls. Some languages like
  // Scheme will optimize these kind of recursions but not most javascript
  // implementations :/
  const existy = x => x !== undefined;

  const tailCallLen = ([head, ...tail], n = 0) => {
    if (!existy(head)) return n;
    return tailCallLen(tail, n + 1);
  }
  const len = tailCallLen([0,1,2]);
}

{
  // conjoin & disjoin
  function andify(...preds) {
    return (...args) => {
      const everything = ([pred, ...rest], truth) => {
        if (!pred)
          return truth;
        else
          return args.every(pred)
            && everything(rest, truth); 
      };
      return everything(preds, true);
    };
  }

  const andifyEs6 = (...preds) => (...args) => {
    return preds.every(pred => args.every(arg => pred(arg)));
  };

  const isNumber = x => typeof x === 'number';
  const isEven = x => x % 2 === 0;

  const evenNums = andify(isNumber, isEven);
  const evenNumsEs6 = andifyEs6(isNumber, isEven);

  let ex1 = evenNums(1, 2);
  //=> false
  let ex2 = evenNumsEs6(1, 2);
  //=> false
  let ex3 = evenNums(2, 4, 6);
  //=> true
  let ex4 = evenNumsEs6(2, 4, 6);
  //=> true

  const orify = (...preds) => (...args) =>
    preds.some(pred => args.some(arg => pred(arg)));

  const zero = x => x === 0;
  const isOdd = x => x % 2 === 1;
  
  const isZeroOrOdd = orify(isOdd, zero);

  ex1 = isZeroOrOdd();
  //=> false
  ex2 = isZeroOrOdd(0,2,4);
  //=> true
}

{
  // mutual exclusion

  // canonical example
  const isOdd = n => n === 0
    ? false
    : isEven(Math.abs(n) - 1); 

  const isEven = n => n === 0
    ? true
    : isOdd(Math.abs(n) - 1);

  let ex1 = isEven(2);
  //=> true
  let ex2 = isOdd(2);
  //=> false
  let ex3 = isEven(3);
  //=> false

  const flat = arr => Array.isArray(arr)
    ? [].concat(...arr.map(flat))
    : [arr];

  let ex4 = flat([[1,2], [3,4, [5]]]);

  const existy = x => x !== 'undefined';
  const isObject = x => typeof x === 'object' && x !== null //&& Array.isArray(x);

  const deepClone = obj => {
    if (!existy(obj) || !isObject(obj))
      return obj;
    var temp = new obj.constructor();
    for(var key in obj)
      if (obj.hasOwnProperty(key))
        temp[key] = deepClone(obj[key]);
    return temp;
  };

  let x = [{a: [1,2,3], b: 42}, {c: {d: []}}];
  let y = deepClone(x);

  let isEqual = x[0].a === y[0].a;
}

{
  // a more useful utility function will be a create a function that can visit
  // all the elements in an array of nested arrays...
  const visit = (f, g, xs) => Array.isArray(xs)
    ? g(xs.map(f))
    : g(xs);
  
  const postDepth = (f, xs) => visit(ys => postDepth(f, ys), f, xs);

  // utilities
  const identity = x => x;
  const isNumber = n => typeof n === "number";

  // examples -- flat array
  let ex1 = visit(isNumber, identity, [1, 2, null, 3]);

  // examples -- nested array
  let ex2 = postDepth(x => {
    return Array.isArray(x) // <- I don't like having to put in this predicate
    ? x
    : x*2;
  }, [1, 2, [1, 2], 3]);

  // polymorphic post depth... (take from ch 5)
  const existy = x => typeof x !== "undefined";
  const doWhen = (predicate, action) => (...args) => predicate(...args)
    ? action(...args)
    : undefined;

  const dispatch = (...fns) => (target, ...args) => {
    for(let fn of fns) {
      let ret = fn.apply(fn, [target, ...args]);
      if (existy(ret))
        return ret;
    }
    return undefined;
  };

  const doubleAll = dispatch(
    doWhen(x => typeof x === "number", x => x*2),
    x => x
  ); 

  let ex3 = postDepth(doubleAll, [1,2,3, null, [1, 2, [1, 2], 3]]);

  const influencedWithStrategy = (strategy, lang, graph) => {
    let results = [];

    strategy(x => {
      if (Array.isArray(x) && x[0] === lang)
        results.push(x[1]);
      return x;
    }, graph);

    return results;
  };

  const influences = [
    ['Lisp', 'Smalltalk'],
    ['Lisp', 'Scheme'],
    ['Smalltalk', 'Self'],
    ['Scheme', 'Javascript'],
    ['Scheme', 'Lua'],
    ['Self', 'Lua'],
    ['Self', 'Javascript']
  ];

  let ex4 = influencedWithStrategy(postDepth, "Lisp", influences);
  //=> ["Smalltalk", "Scheme"]
}

{
  // how to stop from blowing the stack... flatten the calls into a bunch of functions
  const partial1 = (f, arg1) => (arg2) => f(arg1, arg2);

  const trampoline = (f, ...args) => {
    let result = f(...args);
    while (typeof result === "function")
      result = result();
    return result;
  }

  const evenOline = n => n === 0
    ? true
    : partial1(oddOline, Math.abs(n) - 1);

  const oddOline = n => n === 0
    ? false
    : partial1(evenOline, Math.abs(n) - 1);

  const isOneEven = evenOline(1)();

  const isEvenSafe = n => n === 0
    ? true
    : trampoline(partial1(oddOline, Math.abs(n) - 1));

  const isOddSafe = n => n === 0
    ? false
    : trampoline(partial1(evenOline, Math.abs(n) - 1));

  // here are some examples... these are SLOW but they don't blow the stack so
  // that is the pro
  let ex1 = isOddSafe(20000001);
  let ex2 = isEvenSafe(20000001);

  // putting it all together with a lazy generator
  const compose = (...fns) => fns.reduce((a,b) => (...args) => a(b(...args)));

  const log = (message, x) => {
    console.log(message);
    return x;
  };

  const generator = (seed, current, step) => ({
    head: current(seed),
    tail: () => {
      // console.log("forced");
      return generator(step(seed), current, step);
    }
  });
 
  const ints = generator(0, x => x, n => n + 1);

  const defer = (f, ...args) => () => f(...args);

  const genHead = ({ head }) => head;
  const genTail = ({ tail }) => tail();

  const genTake = (n, gen) => {
    const doTake = (x, g, ret = []) => x === 0
      ? ret
      : defer(doTake, x - 1, genTail(g), [...ret, genHead(g)]);

    return trampoline(doTake, n, gen);
  };

  const tenInts = genTake(10, ints);
}

{
  // all the above was great but... recursion is a low level operation and we
  // should just let our utility libraries to handle it!

  const R = require("ramda");

  const influences = [
    ['Lisp', 'Smalltalk'],
    ['Lisp', 'Scheme'],
    ['Smalltalk', 'Self'],
    ['Scheme', 'Javascript'],
    ['Scheme', 'Lua'],
    ['Self', 'Lua'],
    ['Self', 'Javascript']
  ];

  const groupFrom = R.groupBy(R.head);

  const groupedByInfluencees = groupFrom(influences);

  // now bring it all together to get our original output
  const influenced = (graph, node) => R.map(
    xs => xs[1],
    R.prop(node, groupFrom(graph))
  );
  
  const influencedByLisp = influenced(influences, "Lisp");
}

