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
