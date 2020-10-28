import { create } from "domain";

/**
 * Returns random number between 0 and 1.
 * @param a multiplier (0 < a < m)
 * @param b increment (0 <= c < m)
 * @param m modulus (0 < m)
 */
const createPRNG = (a: number, b: number, m: number) => (x: number) => () => ((x = (a * x + b) % m) / m);

export default createPRNG;
