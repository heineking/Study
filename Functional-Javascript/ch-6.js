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