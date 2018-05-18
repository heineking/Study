
function exercise(answer) {
  console.log(answer.question);
  answer();
}

/* Exercise 1 ================================================================*/

exerciseOne.question = `
Exercise 1. Write a function that outputs the following:

#
##
###
####
#####
######

Where the last row is the baseLength of the triangle
`;

function exerciseOne() {
  const range = function*(start, end) {
    while(start <= end)
      yield start++;
  }

  const repeat = function*(action, times) {
    while (times-- > 0)
      yield action();
  };

  const drawTriangle = (baseLength) => [...range(1, baseLength)]
    .map(i => [...repeat(() => "#", i)])
    .map(row => row.join(""))
    .forEach(row => console.log(row));

  drawTriangle(10);
}

// exercise(exerciseOne);

/* Exercise 2 ================================================================*/

exerciseTwo.question = `
Write a program that uses console.log to print all the numbers from 1 to 100, 
with two exceptions. For numbers divisible by 3, print "Fizz" instead of the 
number, and for numbers divisible by 5 (and not 3), print "Buzz" instead.

When you have that working, modify your program to print "FizzBuzz" for numbers
that are divisible by both 3 and 5 (and still print "Fizz" or "Buzz" for numbers 
divisible by only one of those).
`
function exerciseTwo() {
 
  // this is an overly complicated solution to the exercise. An easier way would
  // be to just use imperative for-loop and test each input and render the output
  // based on if-else statements

  // utils
  function compose(...fs) {
    return fs.reduce((a,b) => (...args) => a(b(...args)));
  }

  function curryN(f, arity = f.length, received = []) {
    return (...args) => {
      const combined = [...received, ...args];
      const argsLeft = arity - combined.length;
      return argsLeft > 0
        ? curryN(f, argsLeft, combined)
        : f.apply(null, combined);
    }
  }

  function* range(start, end) {
    while (start <= end)
      yield start++;
  }

  // HOF
  const STOP = 0;

  const printFizz = () => { console.log("Fizz"); return STOP; }
  const printBuzz = () => { console.log("Buzz"); return STOP; }
  const printFizzBuzz = () => { console.log("FizzBuzz"); return STOP; }

  const divisibleBy = curryN((factor, num) => num % factor === 0);
  const divisibleBy3 = divisibleBy(3);
  const divisibleBy5 = divisibleBy(5);
  const divisibleBy3And5 = (n) => divisibleBy3(n) && divisibleBy5(n);

  const doWhen = curryN((action, pred) => {
    if (pred)
      return action();
  });

  const dispatch = (...fs) => (...args) => {
    for(let i = 0; i < fs.length; ++i) {
      const result = fs[i](...args);
      if (result != null)
        return result;
    }
  }

  const actions = dispatch(
    compose(doWhen(printFizzBuzz), divisibleBy3And5),
    compose(doWhen(printFizz), divisibleBy3),
    compose(doWhen(printBuzz), divisibleBy5),
    i => console.log(i)
  );

  [...range(1, 100)].forEach(actions);
}

//exercise(exerciseTwo);

/* Exercise 3 =============================================================== */

exercise3.question = `
Write a program that creates a string that represents an 8×8 grid, using newline
characters to separate lines. At each position of the grid there is either a space 
or a "#" character. The characters should form a chessboard.
`;

function exercise3() {

  function *range(start, end) {
    while (start <= end)
      yield start++;
  }

  function *repeat(action, times) {
    while (times-- > 0)
      yield action();
  }

  function curryN(f, arity = f.length, received = []) {
    return (...args) => {
      const combined = [...received, ...args];
      const argsLeft = arity - combined.length;
      return argsLeft > 0
        ? curryN(f, argsLeft, combined)
        : f.apply(null, combined);
    }
  }

  const row = curryN((unit, length) => [...repeat(() => unit, length/2)].join(""));
  const oddRow = row(" #");
  const evenRow = row("# ");

  const chessboard = (size) => [...range(1, size)].reduce((board, row) =>
    board += `${row % 2 === 1 ? oddRow(size) : evenRow(size)}\n`, "");

  console.log(chessboard(8));
  console.log(chessboard(14));
}

// exercise(exercise3);

exercise4.question = `
The previous chapter introduced the standard function Math.min that returns its 
smallest argument. We can build something like that now. Write a function min 
that takes two arguments and returns their minimum
`;

function exercise4() {

  const randomNumbers = function* (min, max, length) {
    while (--length > 0)
      yield Math.round(Math.random()*(max-min)+min);
  }

  const min = (...xs) => {
    if (xs.length)
      return xs.reduce((y, x) => x < y ? x : y, xs[0]);
  }

  const xs = [...randomNumbers(0, 100, 5)];

  console.log(`${JSON.stringify(xs)}, min: ${min(...xs)}`);
}

// exercise(exercise4);

/* Exercise 5 ================================================================*/

exercise5.question = `
Define a recursive function isEven corresponding to this description. The
function should accept a single parameter (a positive, whole number) and return 
a Boolean.

Test it on 50 and 75. See how it behaves on -1. Why? Can you think of a way to 
fix this?
`;

function exercise5() {
  // N is odd if N - 1 is even
  const isOdd = (n) => {
    if (n < 0) return isOdd(-1*n);
    if (n === 1) return true;
    return isEven(n - 1);
  }

  // N is even if N - 1 is odd
  const isEven = n => {
    if (n < 0) return isEven(-1*n);
    if (n === 0) return true;
    return isOdd(n - 1);
  }

  console.log(isEven(50));
  console.log(isOdd(75));
  console.log(isOdd(-1));
}

/* Exercise 6 ================================================================*/

exercise6.question = `
Write a range function that takes two arguments, start and end, and returns an 
array containing all the numbers from start up to (and including) end.

Next, write a sum function that takes an array of numbers and returns the sum of 
these numbers. Run the example program and see whether it does indeed return 55.

As a bonus assignment, modify your range function to take an optional third 
argument that indicates the “step” value used when building the array. If no 
step is given, the elements go up by increments of one, corresponding to the 
old behavior. The function call range(1, 10, 2) should return [1, 3, 5, 7, 9]. 
Make sure it also works with negative step values so that range(5, 2, -1) 
produces [5, 4, 3, 2].
`;

function exercise6() {

  // non-generator example of range
  
  function range(start, stop, step = 1) {
    const len = Math.abs(start - stop);
    const xs = [];
    
    for(let i = 0; i <= len; ++i)
      if (i % step === 0) {
        xs.push(start);
        start += step;
      }

    return xs;
  }

  console.log(JSON.stringify(range(1, 10)));
  console.log(JSON.stringify(range(1, 10, 2)));
  console.log(JSON.stringify(range(5, 2, -1)));

  const sum = xs => xs.reduce((sum, x) => sum + x, 0);

  console.log(sum(range(1, 10)));
}

// exercise(exercise6);

exercise7.question = `
Arrays have a reverse method which changes the array by inverting the order in 
which its elements appear. For this exercise, write two functions, reverseArray 
and reverseArrayInPlace. The first, reverseArray, takes an array as argument and 
produces a new array that has the same elements in the inverse order. The second, 
reverseArrayInPlace, does what the reverse method does: it modifies the array 
given as argument by reversing its elements. Neither may use the standard 
reverse method.

Thinking back to the notes about side effects and pure functions in the previous 
chapter, which variant do you expect to be useful in more situations? Which one 
runs faster?
`;

function exercise7() {

  // SLOW! This is because a new array is created each time an 'x' is placed
  // into the array. The new array at least N times. There could also be a cost
  // of the spread operator (...) which could incur a n+1 cost per new array
  // because each element of the array is spread into the new array. The O(N)
  // for this would be summation of n + 1 from 1 to N, which is similar to n^2
  // performance
  const reverseArray = xs => xs.reduce((ys, x) => [x, ...ys], []);

  // Quicker! This is quicker because we're not spreading over the previous
  // array elements and just concatenating the elements
  const reverseArrayQuicker = xs => xs.reduce((ys, x) => [x].concat(ys), []);

  // Fast! This is because we lifted out the new array and initialized it the
  // length we wanted which we know already. This is even faster than the in
  // place sort defined below
  const reverseArrayFaster = xs => {
    const ys = new Array(xs.length);

    for(let i = xs.length - 1, j = 0; i >= 0; --i, ++j)
      ys[j] = xs[i];

    return ys;
  };

  const swap = (xs, i, j) => {
    let xi = xs[i];
    xs[i] = xs[j];
    xs[j] = xi;
  };

  const reverseArrayInPlace = xs => {
    for(let i = 0; i < xs.length / 2; ++i)
      swap(xs, i, xs.length - 1 - i);

    return xs;
  };

  let xs1 = ["a", "b", "c"];
  let xs2 = ["a", "b", "c"];
 
  console.log("-- return new --");
  console.log(JSON.stringify(['reverseArray', reverseArray(xs1)]));
  console.log(JSON.stringify(['reverseArrayFaster', reverseArrayFaster(xs1)]));
  console.log(JSON.stringify(['reverseArrayQuicker', reverseArrayQuicker(xs1)]));
  console.log(JSON.stringify(['xs1', xs1]));

  console.log("-- reverse in place --");
  console.log(JSON.stringify(['reverseArrayInPlace', reverseArrayInPlace(xs2)]));
  console.log(JSON.stringify(['xs2', xs2]));

  // timing
  function* range(start, end) {
    while (start <= end)
      yield start++;
  }

  const timer = (fn, name) => {
    const t0 = process.hrtime();
    fn();
    const t1 = process.hrtime(t0);
    const elapsedInMs = Math.round((t1[0]*1000) + (t1[1]/1000000));
    console.log(`Call to ${name} took ${elapsedInMs} ms`);
  };

  const xs = [...range(1, 5000)];
  const ys = [...xs];
  const zs = [...xs];
  const xl = [...range(1, 1000000)];

  timer(() => reverseArray(xs), 'reverseArray');
  // => 800ms

  timer(() => reverseArrayInPlace(xs), 'reverseArrayQuicker');
  // => 1ms

  timer(() => reverseArrayFaster(ys), 'reverseArrayFaster');
  // => 0ms

  timer(() => reverseArrayInPlace(zs), 'reverseArrayInPlace');
  // => 1ms

  timer(() => reverseArrayFaster(xl), 'reverseArrayInPlace, 1m items');
  // => 7ms

  // timer(() => reverseArray(xl), 'reverseArrayInPlace, 1m items');
  // => unfinished...
}

// exercise(exercise7);

exercise8.question = `
Write a function arrayToList that builds up a list structure like the one shown 
when given [1, 2, 3] as argument. Also write a listToArray function that produces 
an array from a list. Then add a helper function prepend, which takes an element 
and a list and creates a new list that adds the element to the front of the input 
list, and nth, which takes a list and a number and returns the element at the 
given position in the list (with zero referring to the first element) or undefined 
when there is no such element.
`;

function exercise8() {
  const arrayToList = ([head, ...tail]) => ({
      value: head,
      rest: head ? arrayToList(tail) : null
    });
 
  const listToArray = ({ value, rest }) => (
    value
      ? [value].concat(listToArray(rest))
      : []
  );

  const prepend = (x, list) => ({ value: x, rest: list });

  const nth = ({ value, rest }, n) => (
    n <= 0
      ? value ? value : undefined
      : nth(rest, --n)
  );
  
  console.log(JSON.stringify(arrayToList([10, 20])));
  // => {"value":10,"rest":{"value":20,"rest":{"rest":null}}}

  console.log(JSON.stringify(listToArray(arrayToList([10, 20]))));
  // => [10, 20]

  console.log(JSON.stringify(prepend(10, prepend(20, null))));
  // => {"value":10,"rest":{"value":20,"rest":null}}

  console.log(nth(arrayToList([10, 20, 30]), 1));
  // => 20

  console.log(nth(arrayToList([10, 20, 30]), 3));
  // => undefined
}

// exercise(exercise8);