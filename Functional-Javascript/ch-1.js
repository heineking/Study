/* -- apply and call -- */

function splat(fn) {
  return (array) => fn.apply(null, array);
};

const addArrayElements = splat((x,y) => x + y);
addArrayElements([1,2]); // => 3

function unsplat(fn) {
  return (...args) => fn.call(null, args);
}

const joinElements = unsplat(arr => arr.join(' '));

joinElements(1, 2);

/* -- abstracting functions -- */

function parseAgeFirstApproach(age) {
  if (typeof age !== 'string') throw new Error(`Expecting a string. Found \`${typeof age}\`.`);
  let a;
  console.log("Attempting to parse age");
  a = parseInt(age, 10);
  if (isNaN(a)) {
    console.log(`Could not parse age: ${age}`);
    a = 0;
  }
  return a;
}

parseAgeFirstApproach("42");
parseAgeFirstApproach("flob");
// parseAgeFirstApproach(null); // => throws error

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(`WARNING: ${thing}`);
}

function note(thing) {
  console.log(`NOTE: ${thing}`);
}

function parseAgeSecondApproach(age) {
  if (typeof age !== 'string') fail("Expecting a string");
  let a;
  note("Attempting to parse and age");
  if (isNaN(a)) {
    warn(`Could not parse age: ${a}`);
    a = 0;
  }
  return a;
}

parseAgeSecondApproach("42");
parseAgeSecondApproach("frob");
// parseAgeSecondApproach(null); // => throws error

/* -- indexing -- */
const isNumber = n => typeof n === "number";
const isIndexed = x => Array.isArray(x) || typeof x === "string";

function nth(a, index) {
  if (!isNumber(index)) fail("Expected a number as the index");
  if (!isIndexed(a)) faile("Non-indexed argument passed");
  if (index < 0 || index > a.length - 1)
    fail("Index value is out of bounds");
  return a[index];
}

nth("foo", 0);
// nth("foo", 3); // => throws out of bounds error
// nth({}, 1); // => throws unsupported error

/* -- further abstraction -- */
const second = (a) => nth(a, 1);
second("foo"); // => 'o'

/* -- sorting -- */

const compareLessThanOrEqual = (x, y) => {
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

[2, 3, 4, 5, 6, 7, -1].sort(compareLessThanOrEqual);

/*
  The above is problematic because of the following example:
*/

if (compareLessThanOrEqual(1,1))
  console.log("less or equal");    // does not run

if ([0,-1].indexOf(compareLessThanOrEqual(1,1)) > -1)
  console.log("less or equal");   // runs but requires the developer to *know* about
                                  // the implementation of the function

// better approach:
const lessOrEqual = (x,y) => x <= y;

// now we broke the sorting :/

[2,3,-1,-6,0,-108,42, 10].sort(lessOrEqual);
// => [42, 10, 3, 2, 0, -1, -6, -108]

// need to map the predicate to a comparator
const comparator = pred => (x,y) => (pred(x,y) ? -1 : (pred(y,x) ? 1 : 0));

// there we go...
[2,3,-1,-6,0,-108,42, 10].sort(comparator(lessOrEqual));
// => [ -108, -6, -1, 0, 2, 3, 10, 42 ]

/* -- csv parser -- */


