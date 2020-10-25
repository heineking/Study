const unique = <T>(xs: T[]) => xs.filter((x, i, ys) => ys.indexOf(x) === i);

export default unique;
