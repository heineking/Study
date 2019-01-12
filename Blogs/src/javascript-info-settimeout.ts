// https://javascript.info/settimeout-setinterval#splitting-cpu-hungry-tasks
/*
  I was interested in trying to write efficient js code that is non-blocking.
  The above blog indicated that proper use ofsetTimeout() will accomplish two 
  things:

  1. free up the JS engine to do other things (like UI interaction)
  2. speed up computation

  I think that #2 is wrong. The two usages of setTimeout (count 2 & 3) did not
  speed up computation but slowed down by 5x. I do believe however that the
  usage of setTimeout will free the JS engine to do other tasks (not proven)
*/


const timer = (name: string) => {
  const start = Date.now();
  return () => {
    console.log(`${name}: ${Date.now() - start} ms`)
  };
};

{
  let i = 0;
  function count() {
    const watch = timer('count'); 
    // heavy job
    for (let j = 0; j < 1e9; j++) {
      i++;
    }
    watch();
  }

  count();
  //=> 2645
}
{
  const watch = timer('count2');
  let i = 0;
  function count2() {
    // chunk the counting...
    do {
      i++
    } while (i % 1e6 !== 0);
    if (i === 1e9) {
      watch();
    } else {
      setTimeout(count2, 0);
    }
  }
  count2();
  // 10921ms
}
{
  const watch = timer('count3');
  let i = 0;
  function count3() {
    // schedule the tasks up front...
    if (i < 1e9 - 1e6) {
      setTimeout(count3, 0); // schedule the call
    }

    do {
      i++;
    } while (i % 1e6 !== 0);

    if (i === 1e9) {
      watch();
    }
  }

  count3();
  //=> 10320ms
}
