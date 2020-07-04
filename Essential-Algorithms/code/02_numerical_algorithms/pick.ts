import { NG } from './prng';

export const pickRandomValues = <T>(prng: NG, xs: T[], m: number, ys: T[] = []): T[] => {
  if (ys.length === m) {
    return ys;
  }

  const index = Math.floor(prng() * xs.length);
  const y = xs[index];

  xs = xs.slice().splice(index, 1);

  return pickRandomValues(
    prng,
    xs,
    m,
    [...ys, y],
  );
};
