import { NG } from './prng';

export const pickRandomValues = <T>(prng: NG, xs: T[], m: number): T[] => {
  const values: T[] = [];
  const ys = xs.slice();
  while (values.length !== m) {
    const index = Math.floor(prng() * ys.length);
    values.push(ys[index]);
    ys.splice(index, 1);
  }
  return values;
}
