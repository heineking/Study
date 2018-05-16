
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