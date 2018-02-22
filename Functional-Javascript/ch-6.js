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
  
}