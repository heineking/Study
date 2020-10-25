const getCounts = <T>(xs: T[]): { [x: string]: number } => xs.reduce((acc, x) => {
  if (!acc[x]) {
    acc[x] = 0;
  }
  acc[x] += 1;
  return acc;
}, {} as any);

export default getCounts;
