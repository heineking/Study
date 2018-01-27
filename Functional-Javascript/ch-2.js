/* -- first class function examples -- */
const fortyTwo = () => 42;
const fortyTwos = [42, () => 42];
const createdFromFn = 42 + (() => 42)();
const weirdAdd = (number, fn) => number + fn();
weirdAdd(42, () => 42); //=> 42

/* -- paradigms -- */
// ===============================================================================
// imperative
{
  let lyrics = [];
  for (let bottles = 99; bottles > 0; --bottles) {
    lyrics.push(`${bottles} bottles of beer on the wall`);
    lyrics.push(`${bottles} of beer`);
    lyrics.push("Take one down pass it around");
    if (bottles > 1) {
      // lyric for next execution of loop
      lyrics.push((bottles - 1) + " bottles of beer on the wall");
    } {
      lyrics.push("No more bottles of beer on the wall!");
    }
  }
}
// ===============================================================================
// functional
{
  function range(start, end, reverse = false) {
    if (start > end) return range(end, start, true);
    // not very functional... but if a tree falls in the woods
    // and no one hears it does it still make a noise?
    var a = [];
    for(; start <= end; ++start) {
      a.push(start);
    }
    return reverse ? a.reverse() : a;
  }

  function lyricSegement(n) {
    const lyrics = [
      `${n} bottles of beer on the wall`,
      `${n} bottles of beer`,
      "Take one down pass it around"
    ];
    return lyrics.concat(n > 1
      ? `${n - 1} bottles of beer on the wall`
      : "No more bottles of beer on the wall!"
    );
  }
  
  function song(start, end, lyricGenerator) {
    return range(start, end)
      .reduce(
        (lyrics, n) => lyrics.concat(lyricGenerator(n)),
        []
      ); 
  }
  const lyrics = song(99, 0, lyricSegement);
}
// ===============================================================================
// prototype-based object-oriented programming
{
  // self-reference semantics
  const a = { name: "a", fn: function() { return this; } };
  a.fn(); //=> references obj 'a'

  const aFn = a.fn;
  aFn(); //=> some global object *not* 'a' like above
}
// ===============================================================================
// meta programming
{
  function Point2D(x, y) {
    this._x = x;
    this._y = y;
  }

  const pt = new Point2D(0, 1);
  //=> {_x: 0, _y: 1}

  // meta-programming against the Point2D
  function Point3D(x, y, z) {
    Point2D.call(this, x, y); // call within the context of Point3D
    this._z = z;
  }

  const threeD = new Point3D(10, -1, 100);
  //=> {_x: 10, _y: -1, _z: 100}
}

// ===============================================================================
// applicative programming
{
  // simple map
  function map([head, ...tail], fn) {
    if (!head) return [];
    return [fn(head), ...map(tail || [], fn)];
  }
  function doubleAll(xs) {
    return map(xs, n => n*2);
  }

  const doubled = doubleAll([1,2,3,4]);
  //=> [2,4,6,8]

  // simple reduce
  function reduce([x1, x2, ...tail], fn) {
    if (!x2) return x1;
    return reduce([fn(x1, x2), ...tail], fn); 
  }

  const average = (xs) => {
    const sum = reduce(xs, (a, b) => a + b);
    return sum / xs.length;
  }

  const averageOfNums = average([1,2,3,4,5]);
  //=> 3

  // simple filter
  function filter([head, ...tail], pred) {
    if (!head) return [];
    return [...(pred(head) ? [head] : []), ...filter(tail || [], pred)]
  }

  const onlyEven = (xs) => {
    return filter(xs, n => n % 2 === 0);
  };

  const evenNums = onlyEven([1,2,3,4,5]);
  //=> [2,4]

  const isObject = x => typeof x === 'object' && !Array.isArray(x) && x !== null;

  function map2(collection, fn) {
    if (isObject(collection)) {
      return map2(Object.keys(collection).map(key => [collection[key], key]), fn);
    }
    if (!collection[0]) return [];
    return [fn(...[].concat(collection[0])), ...map2(collection.slice(1), fn)];
  } 
  const mappedObj = map2({a: 1, b: 2}, (v,k) => [k,v]);
  //=> [['a', 1],['b', 2]]

  // simple find
  function find([head, ...tail], pred) {
    if (pred(head)) return head;
    return find(tail || [], pred);
  }

  const isNumber = n => typeof n === 'number';
  
  const num = find(['a', 'b', 3, 'd'], isNumber);

  // simple reject
  function reject([head, ...tail], pred) {
    if (!head) return [];
    return [...(pred(head) ? [] : [head]), ...reject(tail || [], pred)];
  }

  const charsOnly = reject(['a', 'b', 1, 'c', 2], isNumber);
  //=> ['a', 'b', 'c']

  const complement = pred => (...args) => !pred(...args.reverse());
  const charOnly2 = filter(['a', 'b', 1, 'c', 2], complement(isNumber));
  //=> ['a', 'b', 'c']

  function cat(head, ...args) {
    if (head) return [].concat(head).concat(...args);
    return [];
  }

  const concated = cat([1,2,3], [4,5], [6,7,8]);
  //=> [1,2,3,4,...,8]

  function mapcat(fn, coll) {
    return cat(...map(coll, fn));
  }

  const mapCatted = mapcat(e => [e, ","], [1,2,3]);
  //=> [1, ',', 2, ',', 3, ',']
  
  function butLast(coll) {
    return coll.slice(0, -1);
  }

  function interpose(inter, coll) {
    return butLast(mapcat(e => [e, inter], coll));
  }
  
  const interposed = interpose(",", [1,2,3]);
  //=> [1, ',', 2, ',', 3]
}

// ===============================================================================
// Data Abstraction Example -- Data
const book = (title, isbn, edition) => ({ isbn, title, edition });

const table = [
  book('Don Quixote', '123-457-890', 1),
  book('Hamlet', '444-222-111', 2),
  book('Moby Dick', '777-282-999', 5)  
];

// utilities

const prop = (object, key) => object[key];

const pluck = (xs, key) => xs.map(x => x[key]);

const flatten = xs => [].concat(...xs);

const pick = (object, keys) => keys.reduce((acc, key) => Object.assign(acc, {
  [key]: object[key]
}), {});

const omit = (object, keys) => Object
  .keys(object)
  .reduce((acc, key) => {
    if (keys.includes(key)) {
      return acc;
    }
    acc[key] = object[key];
    return acc;
  }, {});

const keyValues = object => Object.keys(object).map(key => [key, object[key]]);

const rename = (object, renames) => (
  keyValues(renames).reduce((o, [k, v]) => {
    if (object[k]) {
      o[v] = object[k];
    }
    return o;
  }, omit(object, Object.keys(renames)))
); 

// table functions

// this is the same as `SELECT ... FROM ...`
function project(table, keys) {
  return table.map(row => pick(row, keys))
}

// this is same as `col1 as COL1`
function colAs(table, renames) {
  return table.map(row => rename(row, renames));
};

function restrict(table, pred) {
  return table.reduce((newTable, row) => {
    if (pred(row)) {
      return [
        ...newTable,
        row
      ];
    }
    return newTable;
  }, []);
}

// project example
const projectTables = project(table, ['title']);
//=> [
//      { title: 'Don Quixote' },
//      { title; 'Hamlet' },
//      { title: 'Moby Dick' }
//  ]

// break the table abstraction and pluck the titles
const titles = pluck(projectTables, 'title');

// colAs example
const renameEds = colAs(table, { edition: 'ed' });

// restricti
const editionsGreaterThanOne = restrict(table, book => book.edition > 1);

// All together...
const queried = project(
  restrict(
    colAs(table, { edition: 'ed' }),
    book => book.ed > 1
  ),
  ['title']
);

debugger;
