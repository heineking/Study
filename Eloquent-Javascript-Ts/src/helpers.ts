export const range = (s: number, e: number): number[] => {
  return Array.from({ length: (e - s + 1) }, (_, k) => k + s);
};

export const repeatedly = <T>(times: number, f: () => T): T[] => {
  const xs: T[] = new Array(times);
  for (let i = 0; i < times; ++i) {
    xs.push(f());
  }
  return xs;
};
