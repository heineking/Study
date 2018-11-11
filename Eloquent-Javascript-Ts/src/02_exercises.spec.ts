import { expect } from 'chai';
import { drawTriangle } from './02_exercises';

describe('drawTriangle()', () => {
  it('should draw a triangle by base length', () => {
    const triangle = drawTriangle(3);
    expect(triangle).to.equal(`#\n##\n###`);
  });
});
