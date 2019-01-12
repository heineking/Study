// https://javascript.info/settimeout-setinterval#splitting-cpu-hungry-tasks
let i = 0;

const timer = (name: string) => {
  const start = Date.now();
  return () => {
    console.log(`${name}: ${Date.now() - start} ms`)
  };
};

function count() {
  const watch = timer('count'); 
  // heavy job
  for (let j = 0; j < 1e9; j++) {
    i++;
  }
  watch();
}

count();
