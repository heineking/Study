/**
 * Creates a coin using a six-sided die
 * @param die six-sided die
 */
const createCoin = (pred: () => boolean) =>  () => pred() ? 'tails' : 'heads';

export default createCoin;
