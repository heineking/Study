import fs from 'fs';
import path from 'path';
import { encodeFile, decodeFile } from './encode';

const filepath = path.resolve(__dirname, '../examples/large.txt');
const outpath = path.resolve(__dirname, '../examples/large.huff');

const huff = encodeFile(filepath);
fs.writeFileSync(outpath, huff);

fs.writeFileSync(path.resolve(__dirname, '../examples/large-decoded.txt'), decodeFile(outpath).toString('utf8'), 'utf8');
