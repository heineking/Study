import { expect } from 'chai';
import { drawTriangle, fizzBuzz } from './02_exercises';

describe('drawTriangle()', () => {
  it('should draw a triangle by base length', () => {
    const triangle = drawTriangle(3);
    expect(triangle).to.equal(`#\n##\n###`);
  });
});

describe('fizzBuzz()', () => {
  it('should print Fizz when divisible by 3', () => {
    expect(fizzBuzz(3)).to.equal('Fizz');
  });
  it('should print Buzz when divisible by 5', () => {
    expect(fizzBuzz(5)).to.equal('Buzz');
  });
  it('should print FizzBuzz when divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).to.equal('FizzBuzz');
  });
});
