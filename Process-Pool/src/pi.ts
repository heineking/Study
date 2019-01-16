// copied from https://github.com/rvagg/node-worker-farm/blob/master/examples/pi/calc.js

export default function (points: number): number {
  let i = points;
  let inside = 0;
  while (i--) {
    if (Math.pow(Math.random(), 2) + Math.pow(Math.random(), 2) <= 1) {
      ++inside;
    }
  }
  return inside / points * 4;
}