const flatten = <T>(xs: T[][]) => ([] as T[]).concat(...xs);
export default flatten;
