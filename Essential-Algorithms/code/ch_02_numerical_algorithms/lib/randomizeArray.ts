import prng from './prng';
import randomInteger from './randomInteger';

const randomizeArray = <T>(xs: T[]) => {
  const ys: T[] = [...xs];
  for (let i = ys.length - 1; i > 0; i--) {
    const j = randomInteger(prng(), i, ys.length - 1);
    [ys[i], ys[j]] = [ys[j], ys[i]];
  }
  return ys;
};

export default randomizeArray;