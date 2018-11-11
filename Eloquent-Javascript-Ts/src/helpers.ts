function range(start: number, end: number): number[] {
  return Array.from(Array(end - start).keys()).map((i: number) => i + start);
}
