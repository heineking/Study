function fn(...args) {
  return args;
}

/* reverseArgs */
const reversed = reverseArgs(fn)(1,2,3);
expect(reversed).toEqual([3,2,1]);

/* curry */
function sum(a,b) {
  return a + b;
};

const curriedSum = curry(sum);
expect(typeof curriedSum).toBe("function");

const addOne = curriedSum(1);
expect(typeof addOne).toBe("function");

const two = addOne(1);
expect(two).toBe(2);