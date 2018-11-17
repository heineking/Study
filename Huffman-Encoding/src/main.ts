import fs from 'fs';
import encode from './encode';

const sample = fs.readFileSync('../examples/sample.txt', 'utf8');
const encoded = encode(sample);

fs.writeFileSync('../examples/sample.he', encoded);
