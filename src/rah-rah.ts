interface Left<Failure> {
  kind: 'left';
  value: Failure;
}

interface Right<Success> {
  kind: 'right';
  value: Success;
}

type Either<Failure, Success> = Left<Failure> | Right<Success>;

function newLeft<Failure>(value: Failure): Left<Failure> {
  return { kind: 'left', value };
}

function newRight<Success>(value: Success): Right<Success> {
  return { kind: 'right', value };
}

/**
 * Base class for the library. Basically it wraps a promise into an
 * Either monad.
 *
 * Because of historical reasons, that means the two generics are in the order
 * of Failure, then Success. The Either monad traditionally uses "Left" and
 * "Right" in that order (since that's the correct spatial layout), and then it
 * assigns the "Right" to be the "right" or "correct" or "successful" value.
 *
 * Instantiate RahRah with either RahRah.success or RahRah.failure
 */
class RahRah<Failure, Success> {
  private either: Either<Failure, Success>;

  private constructor(either: Either<Failure, Success>) {
    this.either = either;
  }

  /**
   * Construct a RahRah in a failed state
   */
  static failure<Failure>(value: Failure): RahRah<Failure, never> {
    return new RahRah<Failure, never>(newLeft(value));
  }

  /**
   * Construct a RahRah in a successful state
   */
  static success<Success>(value: Success): RahRah<never, Success> {
    return new RahRah<never, Success>(newRight(value));
  }

  /**
   * Lift a promise to wrap its value in a RahRah object.
   *
   * This causes the Promise to always return successfully. To determine the
   * actual result of the Promise, use "good" or "bad" as booleans, or use
   * "yay" or "boo" for the resolved or rejected values.
   */
  static async lift<X, Y>(p: Promise<Y>): Promise<RahRah<X, Y>> {
    return await p
      .then((success: Y) => {
        return this.success<Y>(success);
      })
      .catch((failure: X) => {
        return this.failure<X>(failure);
      });
  }

  /**
   * True if the Promise resolved. False if it rejected.
   */
  get good(): boolean {
    return this.either.kind === 'right';
  }

  /**
   * True if the Promise rejected. False if it resolved.
   */
  get bad(): boolean {
    return this.either.kind === 'left';
  }

  /**
   * Value if the Promise resolved. Throws an exception if called on a
   * rejected object.
   */
  get ok(): Success {
    switch (this.either.kind) {
      case 'right':
        return this.either.value;
      default:
        throw 'Not a successful result';
    }
  }

  /**
   * Alias for `ok`
   */
  get yay(): Success {
    return this.ok;
  }

  /**
   * Value if the Promise rejected. Throws an exception if called on a
   * resolved object.
   */
  get err(): Failure {
    switch (this.either.kind) {
      case 'left':
        return this.either.value;
      default:
        throw 'Not a failed result';
    }
  }

  /**
   * Alias for `err`
   */
  get boo(): Failure {
    return this.err;
  }

  /**
   * If the Promise resolved, returns the resolved value.
   * If the Promise rejected, returns the passed-in "def" value.
   */
  withDefault(def: Success): Success {
    switch (this.either.kind) {
      case 'right':
        return this.either.value;
      default:
        return def;
    }
  }

  /**
   * If the Promise resolved, returns the resolved value.
   * If the Promise rejected, applies the passed-in "defFun" function.
   */
  applyDefault(defFun: (val: Failure) => Success): Success {
    switch (this.either.kind) {
      case 'right':
        return this.either.value;
      default:
        return defFun(this.either.value);
    }
  }

  /**
   * Applies "leftCB" if the Promise resolved.
   * Applies "rightCB" if the Promise rejected.
   *
   * Returns the return value of "leftCB" or "rightCB"
   */
  flatten<CommonOutput>(
    leftCb: (val: Failure) => CommonOutput,
    rightCb: (val: Success) => CommonOutput
  ): CommonOutput {
    switch (this.either.kind) {
      case 'right':
        return rightCb(this.either.value);
      case 'left':
        return leftCb(this.either.value);
    }
  }

  /**
   * Applies the "cb" callback if the Promise resolved.
   * If the Promise rejected, simply return "this."
   */
  map<MappedSuccess>(cb: (val: Success) => MappedSuccess): RahRah<Failure, MappedSuccess> {
    switch (this.either.kind) {
      case 'right':
        return new RahRah<Failure, MappedSuccess>(newRight(cb(this.either.value)));
      case 'left':
        return new RahRah<Failure, MappedSuccess>(newLeft(this.either.value));
    }
  }

  /**
   * Applies the "cb" callback if the Promise resolved.
   * If the Promise rejected, simply return "this."
   *
   * Alias for "map"
   */
  mapYay<MappedSuccess>(cb: (val: Success) => MappedSuccess): RahRah<Failure, MappedSuccess> {
    return this.map(cb);
  }

  /**
   * Applies the "cb" callback if the Promise rejected.
   * If the Promise resolved, simply return "this."
   */
  mapErr<MappedFailure>(cb: (val: Failure) => MappedFailure): RahRah<MappedFailure, Success> {
    switch (this.either.kind) {
      case 'right':
        return new RahRah<MappedFailure, Success>(newRight(this.either.value));;
      case 'left':
        return new RahRah<MappedFailure, Success>(newLeft(cb(this.either.value)));
    }
  }

  /**
   * Applies the "cb" callback if the Promise rejected.
   * If the Promise resolved, simply return "this."
   *
   * Alias for "mapErr"
   */
  mapBoo<MappedFailure>(cb: (val: Failure) => MappedFailure): RahRah<MappedFailure, Success> {
    return this.mapErr(cb);
  }
}

/**
 * Convenience method for RahRah.lift.
 *
 * Usage:
 *
 * let result = await R(promise);
 *
 * if (result.good) { result.yay.toUpperCase() } else { 'n/a' }
 * // or
 * result.map((x: string) => x.toUpperCase()).withDefault('n/a')
 */
let R = function<Failure, Success>(x: Promise<Success>): Promise<RahRah<Failure, Success>> {
  return RahRah.lift(x);
};

export default R;
export { RahRah, R };
