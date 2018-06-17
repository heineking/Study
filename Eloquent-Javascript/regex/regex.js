console.log(/abc/.test("abcde"));
//=> true
console.log(/abc/.test("abxde"));
//=> false

console.log(/[012345689]/.test("in 1992"));
//=> true
console.log(/[0-9]/.test("in 1992"));
//=> true

let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45"));
//=> true

let cartoonCrying = /boo+(hoo+)+/i; // 'i' indicates case insensitive
console.log(cartoonCrying.test("Boohooooohoohooo"));
//=> true

console.log(
  "Liskov, Barbara\nMcCarthy, John\nWadler, Philip"
  .replace(/(\w+), (\w+)/g, "$2 $1")
);
// =>   Barbara Liskov
//      John McCarthy
//      Philip Wadler

let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, str => str.toUpperCase()));
//=> the CIA and FBI

let stock = "1 lemon, 2 cabbages, and 101 eggs";
let minusOne = (match, amount, unit) => {
  amount = +amount - 1;
  if (amount === 1) {
    unit = unit.slice(0, -1);
  } else if (amount === 0) {
    amount = "no";
  }
  return `${amount} ${unit}`;
};
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
//=> no lemon, 1 cabbange, and 100 eggs

let stripComments = (code) => code
  .replace(/\/\*[^]*?\*\//g, "")
  .replace(/(\/\/[^].*)/g, "");

let code = `
  1 + /* 2 */3
  x = 10; // ten!
  1 /* a */ + /* b */ 1
`;
console.log(stripComments(code));
/* =>
  1 +  3
  x = 10;
  1  +  1
*/

let name = "harry";
let text = "Harry is a suspicious character.";

let regexp = new RegExp(`\\b(${name})\\b`, "gi");
console.log(text.replace(regexp, "_$1_"));
//=> _Harry_ is a suspicious character.

// car and cat
verify(/ca[r|t]/,
  ["my car", "bad cats"],
  ["camper", "high art"]);

// pop and prop
verify(/pr?op/,
  ["pop culture", "mad props"],
  ["plop", "prrrop"]);

// ferret, ferry, and ferrari
verify(/^ferr(y|(et)|(ari))$/,
  ["ferret", "ferry", "ferrari"],
  ["ferrum", "transfer A", "ferrets"]);

// Any word ending in ious
verify(/ious\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"]);

// A whitespace character followed by a period, comma, colon, or semicolon
verify(/\s+\.|,|:|;/,
  ["bad punctuation .", "another : one", "however , this too"],
  ["escape the period", " don't match this "]);

// A word longer than six letters
verify(/\b\w{7,}\b/,
  ["hottentottententen"],
  ["no", "hotten totten tenten"]);

// A word without the letter e (or E)
verify(/\b[^\W\e]+\b/i,
  ["red platypus", "wobbling nest"],
  ["earth bed", "learning ape", "BEET"]);

function verify(regexp, yes, no) {
  if (regexp.source === "...") return;
  for(let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}

// replace ' with " but not contractions
let quote = "'I'm the cook,' he said, 'it's my job.'";
console.log(quote.replace(/(^|\W)'|'(\W)/g, "$1\"$2"));

// Fill in this regular expression.
let number = /^[+\-]?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?$/;

/* Explanation
  [+\-]?            - Match + or - zero or one times
  
  (\d+(\.\d*)?)
    \d+             - Match one or more digits
    (\.\d*)         - Match '.' followed by zero or more digits but only match 
                      this group zero or one times
    \.\d+           - Match '.' followed by one or more digits

  ([eE][+\-]?\d+)?
    [eE]            - Match e or E
    [+\-]?          - Match + or - one or more times
    \d+             - Match one or more digits
    - Match all of the above zero or one times
*/

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}