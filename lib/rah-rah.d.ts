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
declare class RahRah<Failure, Success> {
    private either;
    private constructor();
    /**
     * Construct a RahRah in a failed state
     */
    static failure<Failure>(value: Failure): RahRah<Failure, never>;
    /**
     * Construct a RahRah in a successful state
     */
    static success<Success>(value: Success): RahRah<never, Success>;
    /**
     * Lift a promise to wrap its value in a RahRah object.
     *
     * This causes the Promise to always return successfully. To determine the
     * actual result of the Promise, use "good" or "bad" as booleans, or use
     * "yay" or "boo" for the resolved or rejected values.
     */
    static lift<X, Y>(p: Promise<Y>): Promise<RahRah<X, Y>>;
    /**
     * True if the Promise resolved. False if it rejected.
     */
    get good(): boolean;
    /**
     * True if the Promise rejected. False if it resolved.
     */
    get bad(): boolean;
    /**
     * Value if the Promise resolved. Throws an exception if called on a
     * rejected object.
     */
    get ok(): Success;
    /**
     * Alias for `ok`
     */
    get yay(): Success;
    /**
     * Value if the Promise rejected. Throws an exception if called on a
     * resolved object.
     */
    get err(): Failure;
    /**
     * Alias for `err`
     */
    get boo(): Failure;
    /**
     * If the Promise resolved, returns the resolved value.
     * If the Promise rejected, returns the passed-in "def" value.
     */
    withDefault(def: Success): Success;
    /**
     * Applies "leftCB" if the Promise resolved.
     * Applies "rightCB" if the Promise rejected.
     *
     * Returns the return value of "leftCB" or "rightCB"
     */
    flatten<CommonOutput>(leftCb: (val: Failure) => CommonOutput, rightCb: (val: Success) => CommonOutput): CommonOutput;
    /**
     * Applies the "cb" callback if the Promise resolved.
     * If the Promise rejected, simply return "this."
     */
    map<MappedSuccess>(cb: (val: Success) => MappedSuccess): RahRah<Failure, MappedSuccess>;
    /**
     * Applies the "cb" callback if the Promise resolved.
     * If the Promise rejected, simply return "this."
     *
     * Alias for "map"
     */
    mapYay<MappedSuccess>(cb: (val: Success) => MappedSuccess): RahRah<Failure, MappedSuccess>;
    /**
     * Applies the "cb" callback if the Promise rejected.
     * If the Promise resolved, simply return "this."
     */
    mapErr<MappedFailure>(cb: (val: Failure) => MappedFailure): RahRah<MappedFailure, Success>;
    /**
     * Applies the "cb" callback if the Promise rejected.
     * If the Promise resolved, simply return "this."
     *
     * Alias for "mapErr"
     */
    mapBoo<MappedFailure>(cb: (val: Failure) => MappedFailure): RahRah<MappedFailure, Success>;
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
declare let R: <Failure, Success>(x: Promise<Success>) => Promise<RahRah<Failure, Success>>;
export { RahRah, R };
