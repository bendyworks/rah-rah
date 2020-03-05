var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function newLeft(value) {
    return { kind: 'left', value: value };
}
function newRight(value) {
    return { kind: 'right', value: value };
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
var RahRah = /** @class */ (function () {
    function RahRah(either) {
        this.either = either;
    }
    /**
     * Construct a RahRah in a failed state
     */
    RahRah.failure = function (value) {
        return new RahRah(newLeft(value));
    };
    /**
     * Construct a RahRah in a successful state
     */
    RahRah.success = function (value) {
        return new RahRah(newRight(value));
    };
    /**
     * Lift a promise to wrap its value in a RahRah object.
     *
     * This causes the Promise to always return successfully. To determine the
     * actual result of the Promise, use "good" or "bad" as booleans, or use
     * "yay" or "boo" for the resolved or rejected values.
     */
    RahRah.lift = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, p
                            .then(function (success) {
                            return _this.success(success);
                        })
                            .catch(function (failure) {
                            return _this.failure(failure);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(RahRah.prototype, "good", {
        /**
         * True if the Promise resolved. False if it rejected.
         */
        get: function () {
            return this.either.kind === 'right';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RahRah.prototype, "bad", {
        /**
         * True if the Promise rejected. False if it resolved.
         */
        get: function () {
            return this.either.kind === 'left';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RahRah.prototype, "yay", {
        /**
         * Value if the Promise resolved. Throws an exception if called on a
         * rejected object.
         */
        get: function () {
            switch (this.either.kind) {
                case 'right':
                    return this.either.value;
                default:
                    throw 'Not a successful result';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RahRah.prototype, "boo", {
        /**
         * Value if the Promise rejected. Throws an exception if called on a
         * resolved object.
         */
        get: function () {
            switch (this.either.kind) {
                case 'left':
                    return this.either.value;
                default:
                    throw 'Not a failed result';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If the Promise resolved, returns the resolved value.
     * If the Promise rejected, returns the passed-in "def" value.
     */
    RahRah.prototype.withDefault = function (def) {
        switch (this.either.kind) {
            case 'right':
                return this.either.value;
            default:
                return def;
        }
    };
    /**
     * Applies "leftCB" if the Promise resolved.
     * Applies "rightCB" if the Promise rejected.
     *
     * Returns the return value of "leftCB" or "rightCB"
     */
    RahRah.prototype.flatten = function (leftCb, rightCb) {
        switch (this.either.kind) {
            case 'right':
                return rightCb(this.either.value);
            case 'left':
                return leftCb(this.either.value);
        }
    };
    /**
     * Applies the "cb" callback if the Promise resolved.
     * If the Promise rejected, simply return "this."
     */
    RahRah.prototype.map = function (cb) {
        switch (this.either.kind) {
            case 'right':
                return new RahRah(newRight(cb(this.either.value)));
            case 'left':
                return new RahRah(newLeft(this.either.value));
        }
    };
    /**
     * Applies the "cb" callback if the Promise resolved.
     * If the Promise rejected, simply return "this."
     *
     * Alias for "map"
     */
    RahRah.prototype.mapYay = function (cb) {
        return this.map(cb);
    };
    /**
     * Applies the "cb" callback if the Promise rejected.
     * If the Promise resolved, simply return "this."
     */
    RahRah.prototype.mapErr = function (cb) {
        switch (this.either.kind) {
            case 'right':
                return new RahRah(newRight(this.either.value));
                ;
            case 'left':
                return new RahRah(newLeft(cb(this.either.value)));
        }
    };
    /**
     * Applies the "cb" callback if the Promise resolved.
     * If the Promise rejected, simply return "this."
     *
     * Alias for "mapErr"
     */
    RahRah.prototype.mapBoo = function (cb) {
        return this.mapErr(cb);
    };
    return RahRah;
}());
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
var R = function (x) {
    return RahRah.lift(x);
};
export { RahRah, R };
