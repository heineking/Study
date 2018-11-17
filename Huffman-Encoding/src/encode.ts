// index.ts
import fs from 'fs';

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

export const invertTable = (table: {[key: string]: string }): { [key: string]: string } => {
  return Object
    .entries(table)
    .reduce((inverted, entry) => {
      inverted[entry[1]] = entry[0];
      return inverted;
    }, {} as {[key: string]: string});
};

export const createTable = (node: any[] | string, path: string = ''): { [key: string]: string } => {
  if (typeof node === 'string') {
    return { [path]: node };
  }
  const table = {};
  node.forEach((leaf, index) => {
    Object.assign(table, createTable(leaf, `${path}${index}`));
  });
  return table;
}

export const convertTreeToString = (encoding: { [key: string]: string }): string => {
  return Object
    .entries(encoding)
    .reduce((str: string, entry) => {
      const [ch, code] = entry; 
      return str += `${ch}:${code},`;
    }, '');
};

export const encode = (str: string): [string, string] => {
  const chars = str.split('');
  const freq = getCharFrequencies(str.split(''));
  const tree = createTree(Object.entries(freq));
  const encoding = invertTree(tree);
  const encoded = chars.map((char) => encoding[char]).join('');
  return [JSON.stringify(convertToArray(tree)), encoded];
};

const padStart = (bits: string[]): string[] => {
  const zeros = ['0','0','0','0','0','0','0','0'];
  return zeros.concat(bits).slice(-8);
};

export const convertToBuffer = (bits: string): Buffer => {
  const chunks = bits.match(/.{1,8}/g);
  if (chunks === null) {
    throw new Error();
  }
  const encoded = Buffer.alloc(chunks.length);
  for (let i = 0; i < chunks.length; ++i) {
    if (i === chunks.length - 1) {
      chunks[i] = `${chunks[i]}00000000`.slice(0, 8);
    }
    encoded[i] = parseInt(chunks[i], 2);
  }
  
  return encoded;
};

export const convertToBinary = (buff: Buffer): string => {
  let binary = '';
  for (let i = 0; i < buff.length; ++i) {
    const bits = padStart(buff[i].toString(2).split('')); 
    for (let j = 0; j < bits.length; ++j) {
      const bit = bits[j];
      if (bit === '0' || bit === '1') {
        binary += bit; 
      }
    }
  }
  return binary;
};

export const encodeFile = (filepath: string): Buffer => {
  const file = fs.readFileSync(filepath, 'utf8');
  const [encoding, encoded] = encode(file); 
  return Buffer.concat([
    Buffer.from(`${encoding};`, 'utf8'),
    convertToBuffer(encoded),
  ]);
};

export const decodeFile = (filepath: string): Buffer => {
  const buff = fs.readFileSync(filepath);
  const delimIndex = buff.indexOf(59);
  const encoding = JSON.parse(buff.slice(0, delimIndex).toString('utf8'));
  const table = createTable(encoding);
  let binary = convertToBinary(buff.slice(delimIndex + 1));
  let result = '';
  while (binary.length) {
    let i = 1;
    let prefix = binary.substring(0, i);
    while (table[prefix] === undefined && binary.length > i) {
      ++i;
      prefix = binary.substring(0, i);
    }
    binary = binary.substring(i);
    result += table[prefix] === undefined ? '' : table[prefix];
  }
  return Buffer.from(result, 'utf8');
};
