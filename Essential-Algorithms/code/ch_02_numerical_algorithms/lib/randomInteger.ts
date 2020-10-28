/**
 * Returns a random integer between a minimum and max.
 * @param prng random number generator that retuns between 0 and 1
 * @param min minimum integer
 * @param max maximum integer
 */
const randomInteger = (prng: (() => number), min: number, max: number) => Math.floor(prng() * (max - min + 1)) + 1;

export default randomInteger;
