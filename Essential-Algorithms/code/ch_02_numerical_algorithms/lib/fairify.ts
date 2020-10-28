const fairify = <T>(random: () => T, numberOfOutcomes: number): () => T => {
  return (): T => {
    const results = new Set<T>();

    const result = random();
    results.add(result);

    while (results.size !== numberOfOutcomes) {
      const next = random();

      if (results.has(next)) {
        return fairify(random, numberOfOutcomes)();
      }

      results.add(next);
    }

    return result;
  };
};

export default fairify;
