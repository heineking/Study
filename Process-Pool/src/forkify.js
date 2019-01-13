const createHandlers = (fn) => ({
  run(...args) {
    Promise.resolve(fn(...args))
      .then((result) => {
        process.send({ type: 'ret', payload: result });
      })
      .catch((error) => {
        process.send({ type: 'error', payload: error.toString() });
      });
  },
  error(message) {
    process.send({ type: 'error', payload: message });
  },
});

function forkify(fn) {
  const handlers = createHandlers(fn);
  process.on('message', (message) => {
    const { type, payload } = message;
    if (handlers[type]) {
      try {
        handlers[type](payload);
      } catch (err) {
        handlers.error(err.toString());
      }
    } else {
      handlers.error('handler not found');
    }
  });
}

module.exports = forkify;
