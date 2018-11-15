// index.ts

interface FrequencyTable {
  [key: string]: number;
}

export const getCharFrequencies = (xs: string[]): FrequencyTable => {
  return xs.reduce((freq: FrequencyTable, ch): FrequencyTable => {
    if (!freq[ch]) {
      freq[ch] = 0;
    }
    freq[ch] += 1;
    return freq;
  }, {});
}

console.log('hello, world');