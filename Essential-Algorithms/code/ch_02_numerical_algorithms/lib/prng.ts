import createPRNG from './createPRNG';

const prng = (seed: number | null = null) => {
  if (seed === null) {
    return () => Math.random();
  }

  const m = 3682418981;
  const a = 107496637;
  const b = 71920993;
  return createPRNG(a, b, m)(seed);
};

export default prng;
