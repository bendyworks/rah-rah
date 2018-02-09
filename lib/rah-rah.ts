class RahRah<T, U> {
  readonly yay?: T = null;
  readonly boo?: U = null;

  constructor(successValue?: T, failureValue?: U) {
    if (successValue === null && failureValue === null) {
      throw new Error("Must provide either success value or failure value; neither was provided");
    } else if (successValue !== null && failureValue !== null) {
      throw new Error("Must provide only success value or failure value; both were provided");
    }
    this.yay = successValue;
    this.boo = failureValue;
  }

  static async lift<X, Y>(p: Promise<X>): Promise<RahRah<X, Y>> {
    return await p
      .then(success => {
        return new RahRah(success, null);
      })
      .catch(failure => {
        return new RahRah(null, failure);
      });
  }

  get good() {
    return !!this.yay;
  }

  get bad() {
    return !!this.boo;
  }

  withDefault(def: T): T {
    return this.good ? this.yay : def;
  }

  map<A>(cb: (val: T) => A) {
    if (this.good) {
      return new RahRah(cb(this.yay), null);
    } else {
      return this;
    }
  }

  mapBoo<V>(cb: (val: U) => V) {
    if (this.good) {
      return this;
    } else {
      return new RahRah<T, V>(null, cb(this.boo));
    }
  }
}

let R = function<T, U>(x: Promise<T>): Promise<RahRah<T, U>> {
  return RahRah.lift(x);
};

export { RahRah, R };
