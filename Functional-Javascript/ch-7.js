/*
  Functional programming is more than just functions. It is also about thinking a way which will reduce complexity in our applications. One way to do this it to reduce the amount of state changes that occur within the code


*/

// utilities
const thunk = f => () => f();
const compose = (...fns) => fns.reduce((a,b) => (...args) => a(b(...args)));
const map = (f, xs) => xs.map(f);
const join = (del, xs) => xs.join(del);
const random = (min, max) => Math.round(Math.random()*(max-min)+min);
const partial1 = (f, arg1) => arg2 => f(arg1, arg2);

const repeatedly = (n, fn) => {
  if (n <= 0) return [];
  return [fn(), ...repeatedly(n - 1, fn)]
};


const take = (xs, n) => {
  return xs.slice(0, n);
};

{
  // purity -- A case for purity
  const rand = partial1(random, 1);
  const ex1 = rand(10);
  //=> 7

  const ex2 = repeatedly(10, partial1(rand, 10));
  //=> [...some random numbers...]

  const randString = len => {
    const ascii = repeatedly(len, partial1(rand, 26));
    return compose(
      partial1(join, ''),
      partial1(map, n => n.toString(36))
    )(ascii);
  }

  const ex3 = randString(10);
  //=> "somerandomstring"

  /*
    The question is however... how would you test this function? The output changes
    everytime so we do not know what to do.

    We need to try to make pure functions...

    A pure function is one that's output depnds solely on it's inputs and the same
    input maps to the same output
  */

  const generateRandomCharacter = () => rand(26).toString(26);
  const generateString = (charGen, len) => repeatedly(len, charGen).join('');
  const generateRandomString = partial1(generateString, generateRandomCharacter);

  const ex4 = generateRandomString(10);
  //=> A random string with the impure parts extracted and composed

  /*
    We can test the above now... observer the following
  */
  const always = x => () => x;
  const ex5 = generateString(always('a'), 3);
  //=> 'aaa'
}

{
  // Immutability
  const isObject = x => typeof x === "object" && x !== null;
  
  function deepFreeze(obj) {
    if (!Object.isFrozen(obj))
      Object.freeze(obj);

    for (var key in obj) {
      if (!obj.hasOwnProperty(key) || !isObject(obj[key]))
        continue;

      deepFreeze(obj[key]);
    }
  }

  const x = [{ a: [1,2,3], b: 42 }, { c: { d: [] }}];

  deepFreeze(x);
  x[0] = null;
  x[0].a = 42;
  //=> the object was unchanged
  debugger;
}