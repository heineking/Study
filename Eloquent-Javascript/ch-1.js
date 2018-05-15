/*
  Exercise 1. Write a function that outputs the following:

  #
  ##
  ###
  ####
  #####
  ######

  Where the last row is the baseLength of the triangle
*/
{
  console.log("-- start ex 1 --");

  const range = function*(start, end) {
    while(start <= end)
      yield start++;
  }

  const repeat = function*(action, times) {
    while (times-- > 0) {
      yield action();
    }
  };

  const drawTriangle = (baseLength) => [...range(1, baseLength)]
    .map(i => [...repeat(() => "#", i)])
    .map(row => row.join(""))
    .forEach(row => console.log(row));

  drawTriangle(10);

  console.log("-- done ex 1 --");
}

{
  console.log("-- start ex 2 --");
  
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

  console.log("-- end ex 2 --");
}