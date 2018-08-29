const tap = (f) => (x) => {
	f(x);
	return x;
};
const curry = (f, arity = f.length, received = []) => {
	return (...args) => {
		const combined = [...received, ...args];
		const argsLeft = arity - combined.length;
		return argsLeft > 0
			? curry(f, argsLeft, f)
			: f.apply(null, combined);
	};
};
const debug = tap((...args) => console.log(args));
const pipe = (...fns) => fns.reduce((a,b) => (...args) => b(a(...args)));
const map = curry((fn, xs) => xs.map(fn));

const flatten = (xs) => [].concat(...xs);
const flattenN = (ns) => flatten(ns.map(n => Array.isArray(n) ? flattenN(n) : n));

