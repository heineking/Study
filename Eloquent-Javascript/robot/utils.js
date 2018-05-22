function curryN(f, arity = f.length, received = []) {
  return (...args) => {
    const combined = received.concat(args);
    const argsLeft = arity - combined.length;
    return argsLeft > 0
      ? curryN(f, argsLeft, combined)
      : f.apply(null, combined);
  };
}

const compose = (...fs) => fs.reduce((a, b) => (...args) => a(b(...args)));
const map = curryN((f, m) => m.map(f));
const filter = curryN((f, m) => m.filter(f));
const split = curryN((delimiter, s) => s.split(delimiter));

module.exports = {
  compose,
  curryN,
  map,
  filter,
  split
};