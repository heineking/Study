/*

*/
const answers = {};

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

exercise3.question = `
Write a program that creates a string that represents an 8×8 grid, using newline
characters to separate lines. At each position of the grid there is either a space 
or a "#" character. The characters should form a chessboard.
`;

exercise(exercise3);