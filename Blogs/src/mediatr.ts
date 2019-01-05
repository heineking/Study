// Naive attempt to implement Mediatr in Typescript
import "reflect-metadata";

function handler(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
  const method = descriptor.value;
  descriptor.value = function() {
    const [requestType] = Reflect.getMetadata("design:paramtypes", target, propertyKey);
    if (arguments[0] instanceof requestType)
      return method.apply(this, arguments);
    return undefined;
  }; 
}

interface IRequest<T> {}
interface IRequestHandler<T, R> {
  handle(request: T): Promise<R>;
}

class Ping implements IRequest<string>, INotification {};

class PingHandler implements IRequestHandler<Ping, string> {
  @handler
  async handle(ping: Ping) {
    return 'pong';
  }
}

class Greeting implements IRequest<string> {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class GreetingHandler implements IRequestHandler<Greeting, string> {
  @handler 
  async handle(greeting: Greeting) {
    return `Hello, ${greeting.name}`;
  }
}

const handlers: Array<IRequestHandler<any, any>> = [
  new GreetingHandler(),
  new PingHandler(),
];

async function send<R>(request: IRequest<R>): Promise<R | void> {
  for (const handler of handlers) {
    const result = await handler.handle(request);
    if (result !== undefined) {
      return result;
    }
  }
}

send(new Ping()).then(console.log);
send(new Greeting('World')).then(console.log);

// Notification

interface INotification {};
interface INotificationHandler<T extends INotification> {
  handle(notification: T): Promise<void>;
}

class Pong1 implements INotificationHandler<Ping> {
  @handler
  async handle(ping: Ping) {
    console.log('pong1');
  }
}

class Pong2 implements INotificationHandler<Ping> {
  @handler
  async handle(ping: Ping) {
    console.log('pong2');
  }
}

const notificationHandlers: Array<INotificationHandler<any>> = [
  new Pong1(),
  new Pong2(),
];

async function publish(notification: INotification) {
  for (const handler of notificationHandlers) {
    await handler.handle(notification);
  }
}

publish(new Ping()).then(() => console.log('done publishing'));
