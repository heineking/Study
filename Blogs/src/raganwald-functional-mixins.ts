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

const Colored = {
  setColorRGB({ r, g, b }: RGB) {
    this.colorCode = { r, g, b };
    return this;
  },
  getColorRGB(): RGB {
    return this.colorCode;
  },
};

Object.assign(Todo.prototype, Colored);

new Todo('test').setColorRGB({ r: 1, g: 2, b: 3 });
//=> "{"name":"test","done":false,"colorCode":{"r":1,"g":2,"b":3}}"