declare class RahRah<T, U> {

  static failure<T>(value: T): RahRah<T, never>;
  static success<U>(value: U): RahRah<never, U>;

  get good(): boolean;
  get bad(): boolean;

  get yay(): U;
  get boo(): T;

  withDefault(def: U): U;
  flatten<V>(leftCb: (val: T) => V, rightCb: (val: U) => V): V;

  map<B>(cb: (val: U) => B): RahRah<T, B>;
  mapYay<B>(cb: (val: U) => B): RahRah<T, B>;
  mapBoo<A>(cb: (val: T) => A): RahRah<A, U>;

  static lift<X, Y>(p: Promise<Y>): Promise<RahRah<X, Y>>;
}

declare function R<T, U>(x: Promise<U>): Promise<RahRah<T, U>>;
