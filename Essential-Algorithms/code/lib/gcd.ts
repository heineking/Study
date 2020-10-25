
const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  const remainder = a % b;
  return gcd(b, remainder);
};

export default gcd;