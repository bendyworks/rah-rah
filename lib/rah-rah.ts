// import { Promise } from 'es6-promise';

interface Left<T> {
  kind: 'left';
  value: T;
}

interface Right<U> {
  kind: 'right';
  value: U;
}

type Either<T, U> = Left<T> | Right<U>;

function newLeft<T>(value: T): Left<T> {
  return { kind: 'left', value };
}

function newRight<U>(value: U): Right<U> {
  return { kind: 'right', value };
}

class RahRah<T, U> {
  either: Either<T, U>;

  constructor(either: Either<T, U>) {
    this.either = either;
  }

  static failure<T>(value: T): RahRah<T, never> {
    return new RahRah<T, never>(newLeft(value));
  }

  static success<U>(value: U): RahRah<never, U> {
    return new RahRah<never, U>(newRight(value));
  }

  static async lift<X, Y>(p: Promise<Y>): Promise<RahRah<X, Y>> {
    return await p
      .then((success: Y) => {
        return this.success<Y>(success);
      })
      .catch((failure: X) => {
        return this.failure<X>(failure);
      });
  }

  get good(): boolean {
    return this.either.kind === 'right';
  }

  get bad(): boolean {
    return this.either.kind === 'left';
  }

  get yay(): U {
    switch (this.either.kind) {
      case 'right':
        return this.either.value;
      default:
        throw 'Not a successful result';
    }
  }

  get boo(): T {
    switch (this.either.kind) {
      case 'left':
        return this.either.value;
      default:
        throw 'Not a failed result';
    }
  }

  withDefault(def: U): U {
    switch (this.either.kind) {
      case 'right':
        return this.either.value;
      default:
        return def;
    }
  }

  map<B>(cb: (val: U) => B): RahRah<T, B> {
    switch (this.either.kind) {
      case 'right':
        return new RahRah<T, B>(newRight(cb(this.either.value)));
      case 'left':
        return new RahRah<T, B>(newLeft(this.either.value));
    }
  }

  mapYay<B>(cb: (val: U) => B): RahRah<T, B> {
    return this.map(cb);
  }

  mapBoo<A>(cb: (val: T) => A): RahRah<A, U> {
    switch (this.either.kind) {
      case 'right':
        return new RahRah<A, U>(newRight(this.either.value));;
      case 'left':
        return new RahRah<A, U>(newLeft(cb(this.either.value)));
    }
  }
}

let R = function<T, U>(x: Promise<U>): Promise<RahRah<T, U>> {
  return RahRah.lift(x);
};

export { RahRah, R };
