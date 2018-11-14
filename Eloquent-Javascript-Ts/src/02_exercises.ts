import {
  range,
  repeatedly,
  curry,
  dispatch,
  doWhen,
  compose,
} from './helpers';

// exercise 1
/*
#
##
###
####
#####
######
Where the last row is the baseLength of the triangle
*/
export const drawTriangle = (baseLength: number): string => {
  return range(1, baseLength)
    .map((n) => repeatedly(n, () => '#'))
    .map((row) => row.join(''))
    .join('\n');
};

// exercise 2
/*
Write a program that uses console.log to print all the numbers from 1 to 100,
with two exceptions. For numbers divisible by 3, print "Fizz" instead of the
number, and for numbers divisible by 5 (and not 3), print "Buzz" instead.
When you have that working, modify your program to print "FizzBuzz" for numbers
that are divisible by both 3 and 5 (and still print "Fizz" or "Buzz" for numbers
divisible by only one of those).
*/
const divisibleBy = curry((divisor, num) => num % divisor === 0);

const divisibleBy5 = divisibleBy(5);
const divisibleBy3 = divisibleBy(3);
const divisibleBy3And5 = (num: number) => divisibleBy3(num) && divisibleBy5(num);

export const fizzBuzz = dispatch(
  compose(doWhen(() => 'FizzBuzz'), divisibleBy3And5),
  compose(doWhen(() => 'Fizz'), divisibleBy3),
  compose(doWhen(() => 'Buzz'), divisibleBy5),
  (n: number): number => n,
);

/*
Write a program that creates a string that represents an 8×8 grid, using newline
characters to separate lines. At each position of the grid there is either a space
or a "#" character. The characters should form a chessboard.
*/
export const chessboard = (size: number) => {
  if (size % 2 !== 0) {
    throw new TypeError(`size must be an even number. Found ${size} instead`);
  }
  const row = (unit: string) => repeatedly(size / 2, () => unit).join('');
  return range(1, size)
    .map((n): string => row(n % 2 === 1 ? '# ' : ' #'))
    .join('\n');
};
