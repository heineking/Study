import fs from 'fs';
import path from 'path';
import encode from './encode';

const sample = fs.readFileSync(path.resolve(__dirname, '../examples/sample.txt'), 'utf8');
const encoded = encode(sample);

fs.writeFileSync(path.resolve(__dirname, '../examples/sample.he'), encoded);
