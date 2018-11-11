import {
  range,
  repeatedly,
} from './helpers';

export const drawTriangle = (baseLength: number): string => {
  return range(1, baseLength)
    .map((n) => repeatedly(n, () => '#'))
    .map((row) => row.join(''))
    .join('\n');
};
