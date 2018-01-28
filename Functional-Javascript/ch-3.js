// lexical scope
{
  var outer = "outer";
  function precendence() {
    var inner = "inner";
    return function(e) {
      var innerMost = "innerMost";
      return [e, innerMost];
    };
  };

  var result = precendence()("hello");
}

{
  let globals = {};

  function makeBindFun(resolver) {
    return function(k, v) {
      const stack = globals[k] || [];
      globals[k] = resolver(stack, v);
      return globals;
    }
  }

  let stackBinder = makeBindFun(function(stack, v) {
    stack.push(v);
    return stack;
  });

  let stackUnbinder = makeBindFun(function(stack) {
    stack.pop();
    return stack;
  });

  let dynamicLookup = function(k) {
    let slot = globals[k] || [];
    return [...slot].slice(-1).pop();
  };

  stackBinder('a', 1);
  stackBinder('b', 100);
  let lookup = dynamicLookup('a');
  stackBinder('a', '*');
  lookup = dynamicLookup('a');
}

// JS dynamic scope
{
  function globalThis() { return this; }

  globalThis();
  //=> window scope

  globalThis.call('barnabas');
  //=> barnabas

  globalThis.apply('orsulak', []);
  //=> orsulak

  // binding
  let nopeThis = globalThis.bind('nope');
  let nope = nopeThis.call('wat');


  let target = {
    name: 'the right value',
    aux: function() { return this.name; },
    act: function() { return this.aux(); }
  };

  function dynamicBind(obj, ...keys) {
    keys.forEach(key => obj[key] = obj[key].bind(obj));
  }

  // target.act.call('what');
  //=> throws not defined error

  dynamicBind(target, 'aux', 'act');

  target.act.call('what');
}

{
  function strangeIdentity(n) {
    for(var i = 0; i < n; ++i);
    return i; // accessible here because of hoisting
  }
  strangeIdentity(138);
  //=> 138

  function strangerIdentity(n) {
    for(this.i = 0; this.i < n; ++this.i);
    return this.i;
  }
  strangerIdentity(138);
  //=> 138; but modifies the global scope

  strangerIdentity.call({}, 1000);
  //=> 1000

  i;
  //=> 138

  // but we are now constrained to the function scope... What if we need access to the
  // other global vars?

  let globals = { b: 2 };

  function f() {
    this.a = 200;
    return this.a + this.b;
  }

  let result = f.call(Object.assign({}, globals));
  //=> 202
  // but the global is remained unchanged!
}

// Closures
{
  function whatWasTheLocal() {
    let captured = "Oh hai";
    return () => `The local was: ${captured}`;
  }

  let reportLocal = whatWasTheLocal();
  reportLocal();
  //=> The local was: Oh hai


  // closure over function arguments
  function createScaleFunction(FACTOR) {
    return v => v.map(n => n*FACTOR);
  }

  let scale10 = createScaleFunction(10);
  scale10([1,2,3]);
  //=> [10,20,30]
  
  function createWeirdScaleFunction(FACTOR) {
    return function(v) {
      this.FACTOR = FACTOR;
      return v.map(function(n) {
        return n * this.FACTOR;
      }.bind(this));
    };
  }

  scale10 = createWeirdScaleFunction(10);
  let scaled = scale10.call({}, [5,6,7]);
  //=> [50, 60, 70]


  // closing over an object
  let o = { a: 42 };
  let showObject = o => () => o;

  let showO = showObject(o);
  let retreivedO = showO();
  //=> { a: 42 }

  // problem is that 'o' is in and outside of the scope of the function
  o.a = 43;
  let updatedO = showO();
  //=> { a: 43 }

  // confusion can happen here because the updated to 'o' can happen accross seemingly
  // invisble boundaries

  
  // module pattern to create private scope...
  let pingpong = (function() {
    let PRIVATE = 0;
    return {
      inc: n => PRIVATE += n,
      dec: n => PRIVATE -= n
    };
  })();

  pingpong.inc(10);
  let final = pingpong.dec(7);
  //=> 3

  // configuration of functions using closures
  const plucker = field => obj => obj && obj[field];
  
  let best = { title: 'Infinite Jest', author: 'DFW' };
  let books = [{ title: "Chthon"}, {starts: 5}, {title: "Botchan"}];

  let getTitle = plucker('title');
  let bestTitle = getTitle(best);

  let third = plucker(2);
  let pluckedFromArray = third(books);
  let withTitles = books.filter(getTitle);
}