type Result = Record<number | string, number>;

export const play = (generator: () => number | string, times: number) => {

  const counts: Result = {};

  for (let i = 0; i < times; ++i) {
    const x = generator();
    counts[x] = (counts[x] || 0) + 1;
  }

  const distributions: Result = Object.entries(counts)
      .reduce((dists, [x, count]) => ({
        ...dists,
        [x]: count / times,
      }), {});

  const getDistributionDiffs = (expected: Result): Result =>
    Object.entries(expected)
      .reduce((diffs, [x, dist]) => ({
        ...diffs,
        [x]: Math.abs(distributions[x] - dist)
      }), {});

  const isFair = (prob: number, tolerance: number) =>
      Object.values(distributions)
        .map((dist) => dist - prob)
        .map(Math.abs)
        .every((diff) => diff < tolerance);

  return {
    counts,
    distributions,
    getDistributionDiffs,
    isFair,
  };
};
