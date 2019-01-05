// http://raganwald.com/2015/06/17/functional-mixins.html

class Todo {
  public static readonly defaultName: string = 'Untitled';
  public name: string;
  public done: boolean;

  constructor(name: string = Todo.defaultName) {
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
interface Colored {}
const shared = Symbol('shared');

const functionalMixin = (behavior: any) => {
  const instanceKeys = Reflect.ownKeys(behavior).filter(key => key !== shared);
  const sharedBehavior = behavior[shared] || {};
  const sharedKeys = Reflect.ownKeys(sharedBehavior);

  function mixin (target: object) {
    for (const property of instanceKeys) {
      Object.defineProperty(target, property, { value: behavior[property] });
    } 
    return target;
  }
  for (const property of sharedKeys) {
    Object.defineProperty(mixin, property, {
      value: sharedBehavior[property],
      enumerable: sharedBehavior.propertyIsEnumerable(property),
    });
  }
  return mixin;
};

functionalMixin.shared = shared;

const Colored: any = functionalMixin({
  setColorRGB({ r, g, b }: RGB) {
    this.colorCode = { r, g, b };
    return this;
  },
  getColorRGB(): RGB {
    return this.colorCode;
  },
  [functionalMixin.shared]: {
    RED: { r: 255, g: 0, b: 0 },
    GREEN: { r: 0, g: 255, b: 0 },
    BLUE: { r: 0, g: 0, b: 255 },
  },
});

Colored(Todo.prototype);

new Todo('test').setColorRGB({ r: 1, g: 2, b: 3 });
//=> "{"name":"test","done":false,"colorCode":{"r":1,"g":2,"b":3}}"

const urgent = new Todo("finish blog post");
urgent.setColorRGB(Colored.RED);
debugger;