// https://medium.com/@benlesh/learning-observable-by-building-observable-d5da57405d87

interface Subscriber<T> {
  (observer: Observer<T>): () => void;
}

interface Observer<T> {
  next: (result: T) => void;
  error: (reason?: any) => void;
  complete: () => void;
}

interface Observable<T> {
  listen: (observer: Observer<T>) => () => void;
  map: <U>(f: (a: T) => U) => Observable<U>;
}

const Observable = <T>(subscribe: Subscriber<T>): Observable<T> => ({
  listen: (observer) => subscribe(observer),
  map: <U>(f: (a: T) => U): Observable<U> => Observable((observer) => {
    return subscribe({
      next: (a: T) => observer.next(f(a)),
      complete: () => observer.complete(),
      error: (e?: any) => observer.error(e),
    });
  }),
});

let i = 0;
const imageFromText = () => new Promise<any>((resolve) => {
  ++i;
  resolve({
    type: i < 5 ? null : 'png',
    base64: i < 5 ? null : 'image123456',
  });
});

class NotModified extends Error {};

const observable = Observable((observer: Observer<string>) => {
  (async () => {
    const { type, base64 } = await imageFromText();
    if (type && base64) {
      observer.next(`${type};${base64}`);
      observer.complete();
    } else {
      observer.error(new NotModified());
    }
  })();
  return () => {};
});

observable
  .map((image) => image.toUpperCase())

const run = () => observable.listen({
  complete() {
    console.log('completed');
  },
  error(reason: any): void {
    if (reason instanceof NotModified) {
      setTimeout(() => run(), 1000);
    }
  },
  next(image: string): void {
    console.log(image);
  }
});

run();
