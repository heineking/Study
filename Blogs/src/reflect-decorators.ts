// https://www.typescriptlang.org/docs/handbook/decorators.html
import "reflect-metadata";

function f() {
  console.log('f(): evaluated');
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log('f(): called');
  }
}

function g() {
  console.log('g(): evaluated');
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log('g(): called');
  }
}

class C {
  @f()
  @g()
  method() {}
}
/* =>
  f(): evaluated
  g(): evaluated
  g(): called
  f(): called
*/

const templateKey = Symbol('format');

function format(template: string) {
  return Reflect.metadata(templateKey, template);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(templateKey, target, propertyKey);
}

const requiredMetaKey = Symbol('required');

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const existingRequired: number[] = Reflect.getOwnMetadata(requiredMetaKey, target, propertyKey) || [];
  existingRequired.push(parameterIndex);
  Reflect.defineMetadata(requiredMetaKey, existingRequired, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value;
  descriptor.value = function() {
    const requiredParams: number[] = Reflect.getOwnMetadata(requiredMetaKey, target, propertyName);
    if (requiredParams) {
      for (let parameterIndex of requiredParams) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument");
        }
      }
    }
    return method.apply(this, arguments);
  }
}

function validateSet<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set;
  descriptor.set = function (value: T) {
    const type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError("Invalid type.");
    }
    return set.call(this, value);
  }
}


class Greeter {
  @format("Hello, %s")
  greeting: string;
  _name: String;

  constructor(message: string) {
    this.greeting = message;
  }

  @validate
  greet(@required punctuation: string): string {
    let template = getFormat(this, "greeting");
    return `${template.replace("%s", this.greeting)}${punctuation})`;
  }

  @validateSet
  set name(value: String) {
    this._name = value
  };
  get name() { return this._name; };
}

const greeter = new Greeter('world');

greeter.greet('!');
//=> Hello, world
greeter.name = new String('earth');


debugger;