const timed = (fn: (...args: any[]) => any): (...args: any[]) => { result: any, executionTime: number } => {
  return (...args: any[]): any => {
    const start = process.hrtime();
    const result = fn(...args);
    const hrtime = process.hrtime(start);

    const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
    const milliseconds = nanoseconds / 1e6;

    return {
      result,
      executionTime: milliseconds,
    };
  };
};

export default timed;
