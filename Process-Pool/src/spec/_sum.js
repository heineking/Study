const forkify = require('../forkify.js');

const computation = (n) => {
  let sum = 0;
  for (let i = 0; i <= n; ++i) {
    sum += i;
  }
  return sum;
};

forkify(computation);
