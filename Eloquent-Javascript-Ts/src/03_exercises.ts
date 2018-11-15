// create a minimum function
export const min = (xs: number[]) => xs.reduce((m: number, x) => {
  return m < x ? m : x;
});

/*
Define a recursive function isEven corresponding to this
description. The function should accept a single parameter
(a positive, whole number) and return a Boolean.
*/
export const isEven = (n: number): boolean => {
  if (n < 0) {
    return isEven(-1 * n);
  }
  if (n === 0) {
    return true;
  }
  if (n === 1) {
    return false;
  }
  return isOdd(n - 1);
};

export const isOdd = (n: number): boolean => {
  if (n < 0) {
    return isOdd(-1 * n);
  }
  if (n === 0) {
    return false;
  }
  if (n === 1) {
    return true;
  }
  return isEven(n - 1);
};

/*
Next, write a function called countChar that behaves
like countBs, except it takes a second argument that
indicates the character that is to be counted (rather
than counting only uppercase “B” characters). Rewrite
countBs to make use of this new function.
*/

export const countChars = (str: string, countChar: string) => {
  return str
    .split('')
    .reduce((count: number, ch: string) => {
      return count += ch === countChar ? 1 : 0;
    }, 0);
};
