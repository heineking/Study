const pickRandomItems = <T>(prng: () => number, xs: T[], m: number): T[] => {
  const items: T[] = [];
  const ys = xs.slice();
  while (items.length !== m) {
    const index = Math.floor(prng() * ys.length);
    items.push(ys[index]);
    ys.splice(index, 1);
  }
  return items;
};

export default pickRandomItems;
