// index.ts

interface FrequencyTable {
  [key: string]: number;
}

interface Node {
  0?: Node | string;
  1?: Node | string;
}

export const getCharFrequencies = (xs: string[]): FrequencyTable => {
  return xs.reduce((freq: FrequencyTable, ch): FrequencyTable => {
    if (!freq[ch]) {
      freq[ch] = 0;
    }
    freq[ch] += 1;
    return freq;
  }, {});
};

export const createTree = (entries: Array<[string | Node, number]>): Node => {
  const [x, y, ...rest] = entries.sort((a, b) => a[1] - b[1]);
  if (y === undefined) {
    return x[0] as Node;
  } 
  const node: Node = { "0": x[0], "1": y[0] };
  const score: number = x[1] + y [1];
  return createTree(rest.concat([[node, score]]));
};

export const invertTree = (x: any, path: string = ''): any => {
  if (typeof x !== 'object') {
    return { [x]: path };
  }
  const inverted = Object.create(null);
  for(const [key, value] of Object.entries(x)) {
    Object.assign(inverted, invertTree(value, `${path}${key}`));
  }
  return inverted;
};

export const convertToArray = (node: Node): any[] => {
  return Object
    .entries(node)
    .reduce((xs: any[], entry): any[] => {
      const [key, val] = entry;
      xs[+key] = typeof val === 'string'
        ? val
        : convertToArray(val);
      return xs;
    }, []);
};

export const encode = (str: string): string => {
  const chars = str.split('');
  const freq = getCharFrequencies(str.split(''));
  const tree = createTree(Object.entries(freq));
  const encoding = invertTree(tree);
  const encoded = chars.map((char) => encoding[char]).join('');
  return `${JSON.stringify(convertToArray(tree))};${encoded}`;
};
