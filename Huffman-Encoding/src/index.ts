import fs from 'fs';
import path from 'path';
import { encodeFile, decodeFile } from './encode';

const filepath = path.resolve(__dirname, '../examples/sample.txt');
const outpath = path.resolve(__dirname, '../examples/sample.huff');

const huff = encodeFile(filepath);
fs.writeFileSync(outpath, huff);

console.log(decodeFile(outpath).toString('utf8'));
