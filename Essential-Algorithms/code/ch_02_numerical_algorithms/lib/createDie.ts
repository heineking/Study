import randomInteger from './randomInteger';

type Probabilities = [number, any][];
type ProbabilitiesArray = [number, number, any][];

const createProbabilityArray = <T>(xs: [number, T][]): ProbabilitiesArray => {
  return xs.reduce((ys, [prob, result], index) => {
    const min = index === 0 ? 0 : ys[index - 1][1];
    return ys.concat([[min, min + prob, result]]);
  }, [] as ProbabilitiesArray);
};

const createProbabilisticResults = (probabilities: Probabilities) => {
  const probabilitiesArray = createProbabilityArray(probabilities);
  return (prng: () => number) => {
    const n = prng();
    const result = probabilitiesArray.find(([min, max]) => min <= n && n < max);
    if (!result) {
      throw new Error();
    }
    return result[2];
  };
};

/**
 * Creates a die with number of sides
 * @param prng random number generator
 */
const createDie = (prng: () => number, sides: number = 6, probabilities: Probabilities = []) => {
  if (probabilities.length === 0) {
    return () => randomInteger(prng, 1, sides);
  }
  const probablisticResult = createProbabilisticResults(probabilities);
  return () => probablisticResult(prng);
};

export default createDie;
