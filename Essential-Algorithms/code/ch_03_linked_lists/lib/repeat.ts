const repeat = <T>(fn: () => T, n: number) => {
  const xs: T[] = [];
  for (let i = 0; i < n; ++i) {
    xs.push(fn());
  }
  return xs;
};

export default repeat;