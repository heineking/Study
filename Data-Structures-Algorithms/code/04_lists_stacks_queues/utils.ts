export const arrayToObject = <T>(xs: T[]) => (
  xs.reduce((ys, x, i) => {
    return Object.assign(ys, { [i]: x })
  }, Object.create(null))
);