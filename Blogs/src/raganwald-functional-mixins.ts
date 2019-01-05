// http://raganwald.com/2015/06/17/functional-mixins.html

class Todo {
  public name: string;
  public done: boolean;

  constructor(name: string) {
    this.name = name || 'untitled';
    this.done = false;
  }
  public do(): Todo {
    this.done = true;
    return this;
  }
  public undo(): Todo {
    this.done = false;
    return this;
  }

  public toString(): string {
    return JSON.stringify(this);
  }
  // mixed behaviors
  public setColorRGB!: (rgb: RGB) => Todo;
}

interface RGB { r: number; g: number; b: number };

const functionalMixin = (behavior: object) => (target: object) => Object.assign(target, behavior);

const Colored = functionalMixin({
  setColorRGB({ r, g, b }: RGB) {
    this.colorCode = { r, g, b };
    return this;
  },
  getColorRGB(): RGB {
    return this.colorCode;
  },
});

Colored(Todo.prototype);

new Todo('test').setColorRGB({ r: 1, g: 2, b: 3 });
//=> "{"name":"test","done":false,"colorCode":{"r":1,"g":2,"b":3}}"