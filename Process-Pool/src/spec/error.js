const forkify = require('../forkify.js');

const computation = (n) => {
  throw new Error('boom');
};

forkify(computation);
