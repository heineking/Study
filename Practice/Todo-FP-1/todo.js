const createElement = document.createElement.bind(document);

function prop(obj, name) {
  return obj[name];
}

/* -- FP Helpers -- */

function reverseArgs (fn) {
  return (...args) => fn(...args.reverse())
};

function curry (fn, arity = fn.length) {
  return (function currying(...prev) {
    return (...next) => {
      const args = [...prev, ...next];
      return args.length >= arity ? fn(...args) : currying(...args);
    };
  }());
}
