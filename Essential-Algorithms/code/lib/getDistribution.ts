import getCounts from './getCounts';

const getDistribution = <T>(xs: T[]): { [key: string]: number } => {
  const n = xs.length;
  const counts = getCounts(xs);
  const entries = Object.entries(counts) as [string, number][];

  return entries.reduce((acc, [side, m]) => ({
    ...acc,
    [side]: m / n,
  }), {})
};

export default getDistribution;
