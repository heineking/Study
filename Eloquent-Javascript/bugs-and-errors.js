const { expect } = require("chai");
class MultipicatorUnitFailure extends Error {};

const curry = (fn, arity = fn.length, received = []) => {
  return (...args) => {
    const combined = [...received, ...args];
    const argsLeft = arity - combined.length;
    return argsLeft > 0
      ? curry(fn, argsLeft, combined)
      : fn.apply(null, combined);
  };
};

const succeed = () => Math.random() < 0.2;

const primitiveMultiply = curry((succeed, a, b) => {
  if (succeed()) {
    return a * b;
  }
  throw new MultipicatorUnitFailure("Klunk");
});

const retry = (fn, pred) => (...args) => {
  try {
    return fn(...args);
  } catch (ex) {
    if (pred(ex))
      return retry(fn, pred)(...args);
    throw ex;
  }
};

const multiply = retry(primitiveMultiply(succeed), err => err instanceof MultipicatorUnitFailure);

describe("primitiveMultiply", () => {
  it("should throw an error when succeed fails", () => {
    expect(() => primitiveMultiply(() => false, 1, 2)).to.throw(MultipicatorUnitFailure);
  });
  it("should return the multiplation result when succeed returns true", () => {
    expect(primitiveMultiply(() => true, 1, 2)).to.equal(2);
  })
});

describe("multiply", () => {
  it("should return the multiplation result", () => {
    expect(multiply(8,8)).to.equal(64);
  });
});

const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true; },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

const withBoxUnlocked = (body) => {
  try {
    box.unlock();
    body(box);
  } catch(err) {
    throw err;
  } finally {
    box.lock();
  }
};

withBoxUnlocked((box) => {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}

describe("box", () => {
  it("should be locked", () => {
    expect(box.locked).to.equal(true);
  });
});