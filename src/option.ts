/**
 * Type [[Option]] represents an optional value: every [[Option]] is either [[Some]] and contains
 * a value, or [[None]], and does not. It can be a useful substitute for `null` due to it's
 * functional nature that brings less errors and needs less checks.
 *
 * [[Option]]s are commonly paired with pattern matching to query the presence of a value and take
 * action, always accounting for the [[None]] case.
 */ /** for typedoc */

import {Match} from './match';
import {Result, Ok, Err} from './result';

/**
 * Object contains pattern matching functions for an [[Option]].
 *
 * This object should be sent as argument to the [[Option.match]] method.
 */
export type OptionMatcher<T, U> = {
  Some: (value: T) => U,
  None: () => U
};

/**
 * Creates an [[Option]] contains some value.
 *
 * #### Example
 * ```ts
 * const x = Some(15);
 * assert(x instanceof Option);
 * assert.equal(x.unwrap(), 15);
 * ```
 * @param value a value Options will wrap over.
 * @constructor
 */
export const Some = <T>(value: T) => new Option<T>(value);

/**
 * Creates an [[Option]] contains no value.
 *
 * **Note:** if you want strong typing define the `Option` type for variable the `Option` will be
 * assigned, otherwise it will be `Option<any>`.
 *
 * #### Example
 * ```ts
 * const x: Option<number> = None();
 * assert(x instanceof Option);
 * ```
 * @constructor
 */
export const None = () => new Option<any>(null);

export class Option<T> implements Match {
  constructor(protected value: T) {}

  /**
   * Gets `true` if the option is a `Some` value.
   *
   * #### Examples:
   * ```ts
   * const x: Option<number> = Some(2);
   * assert.equal(x.isSome, true);
   *
   * const x: Option<number> = None();
   * assert.equal(x.isSome, false);
   * ```
   */
  public get isSome(): boolean {
    return !!this.value;
  }

  /**
   * Gets `true` if the option is a `None` value.
   *
   * #### Examples:
   * ```ts
   * const x: Option<number> = Some(2);
   * assert.equal(x.isNone, false);
   *
   * const x: Option<number> = None;
   * assert.equal(x.isNone, true);
   * ```
   */
  public get isNone(): boolean {
    return !this.value;
  }

  /**
   * Unwraps an option, yielding the content of a `Some`.
   *
   * #### Examples:
   * ```ts
   * const x = Some('value');
   * assert.equal(x.expect('the world is ending'), 'value');
   *
   * const x: Option<string> = None;
   * x.expect('the world is ending'); // throws an error with `the world is ending`
   * ```
   *
   * #### Throws
   * Throws an error if the value is a `None` with a custom error message provided by `msg`.
   *
   * @param msg custom error message
   */
  public expect(msg: string): T {
    if (this.isSome) {
      return this.value;
    }

    throw new Error(msg);
  }

  /**
   * Moves the value `v` out of the `Option<T>` if it is `Some(v)`.
   *
   * In general, because this function may throw, its use is discouraged. Instead, prefer to
   * use [[Option.match]] and handle the `None` case explicitly.
   *
   * #### Examples:
   * ```ts
   * const x = Some('air');
   * assert.equal(x.unwrap(), 'air');
   *
   * const x: Option<string> = None;
   * assert.equal(x.unwrap(), 'air'); // fails
   * ```
   *
   * #### Throws
   * Throws an error if the self value equals `None`.
   */
  public unwrap(): T {
    if (this.isSome) {
      return this.value;
    }

    throw new Error();
  }

  /**
   * Returns the contained value or a default.
   *
   * #### Examples:
   * ```ts
   * assert.equal(Some('car').unwrapOr('bike'), 'car');
   * assert.equal(None().unwrapOr('bike'), 'bike');
   * ```
   *
   * @param def default value
   */
  public unwrapOr(def: T): T {
    return this.isSome
      ? this.value
      : def;
  }

  /**
   * Returns the contained value or computes it from a closure.
   *
   * #### Examples:
   * ```ts
   * const k = 10;
   * assert.equal(Some(4).unwrapOrElse(() => 2 * k), 4);
   * assert.equal(None().unwrapOrElse(() => 2 * k), 20);
   * ```
   *
   * @param cb callback to calculate default value
   */
  public unwrapOrElse(cb: () => T): T {
    return this.isSome
      ? this.value
      : cb();
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.
   *
   * #### Examples:
   * Convert an `Option<string>` into an `Option<number>`, consuming the original:
   * ```ts
   * const maybeSomeString = Some('Hello, World!');
   * const maybeSomeLength = maybeSomeString.map(s => s.length);
   *
   * assert.deepEqual(maybeSomeLength, Some(13));
   * ```
   *
   * @param cb callback to map wrapped value
   */
  public map<U>(cb: (value: T) => U): Option<U> {
    return this.isSome
      ? Some(cb(this.value))
      : <Option<U>><any>this; // None()
  }

  /**
   * Applies a function to the contained value (if any), or returns a `def` (if not).
   *
   * #### Examples:
   * ```ts
   * const x = Some('foo');
   * assert.equal(x.mapOr(42, v => v.length), 3);
   *
   * const x: Option<string> = None;
   * assert.equal(x.mapOr(42, v => v.length), 42);
   * ```
   *
   * @param def default value
   * @param cb callback to map wrapped value
   */
  public mapOr<U>(def: U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(this.value)
      : def;
  }

  /**
   * Applies a function to the contained value (if any), or computes a `def` (if not).
   *
   * #### Examples:
   * ```ts
   * const k = 21;
   *
   * const x = Some('foo');
   * assert.equal(x.mapOrElse(() => 2 * k, v => v.length), 3);
   *
   * const x: Option<string> = None;
   * assert.equal(x.mapOrElse(() => 2 * k, v => v.length), 42);
   * ```
   *
   * @param def callback to calculate default value
   * @param cb callback to map wrapped value
   */
  public mapOrElse<U>(def: () => U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(this.value)
      : def();
  }

  /**
   * Matches option to the received matcher executing the appropriate branch defined in the
   * received matcher.
   *
   * #### Examples:
   * ```ts
   * const x = Some(45);
   *
   * const y = x.match({
   *   Some: v => v + 5,
   *   None: () => 10
   * });
   *
   * assert.equal(y, 50);
   *
   * const x = None();
   *
   * const y = a.match({
   *   Some: v => v + 5,
   *   None: () => 10
   * });
   *
   * assert.equal(y, 10);
   *
   * const x = Some('foo');
   *
   * x.match({
   *   Some: v => console.log(v), // prints `foo`
   *   None: () => console.log('nothing')
   * });
   * ```
   *
   * @param matcher an object to perform pattern matching
   */
  public match<U>(matcher: OptionMatcher<T, U>): U {
    return this.isSome
      ? matcher.Some(this.value)
      : matcher.None();
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None`
   * to `Err(err)`.
   *
   * #### Examples:
   * ```ts
   * const x = Some('foo');
   * assert.deepEqual(x.okOr(0), Ok('foo'));
   *
   * const x: Option<&str> = None;
   * assert.deepEqual(x.okOr(0), Err(0));
   * ```
   *
   * @param err custom error value
   */
  public okOr<E>(err: E): Result<T, E> {
    return this.isSome
      ? Ok(this.value)
      : Err(err);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None`
   * to `Err(err())`.
   *
   * #### Examples:
   * ```ts
   * let x = Some('foo');
   * assert.deepEqual(x.okOrElse(() => 0), Ok('foo'));
   *
   * let x: Option<&str> = None;
   * assert.deepEqual(x.okOrElse(() => 0), Err(0));
   * ```
   *
   * @param err callback to calculate custom error value
   */
  public okOrElse<E>(err: () => E): Result<T, E> {
    return this.isSome
      ? Ok(this.value)
      : Err(err());
  }

  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * #### Examples:
   * ```ts
   * const x = Some(2);
   * const y: Option<string> = None();
   * assert.deepEqual(x.and(y), None());
   *
   * const x: Option<number> = None();
   * const y = Some('foo');
   * assert.deepEqual(x.and(y), None());
   *
   * const x = Some(2);
   * const y = Some('foo');
   * assert.deepEqual(x.and(y), Some('foo'));
   *
   * const x: Option<number> = None();
   * const y: Option<string> = None();
   * assert.deepEqual(x.and(y), None());
   * ```
   *
   * @param optb another option
   */
  public and<U>(optb: Option<U>): Option<U> {
    return this.isSome
      ? optb
      : <Option<U>><any>this; // None()
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `cb` with the wrapped value and
   * returns the result.
   *
   * Some languages call this operation flatmap.
   *
   * #### Examples:
   * ```ts
   * const sq: (x: number): Option<number> = x => Some(x * x);
   * const nope: () => Option<number> = () => None();
   *
   * assert.deepEqual(Some(2).andThen(sq).andThen(sq), Some(16));
   * assert.deepEqual(Some(2).andThen(sq).andThen(nope), None());
   * assert.deepEqual(Some(2).andThen(nope).andThen(sq), None());
   * assert.deepEqual(None().andThen(sq).andThen(sq), None());
   * ```
   *
   * @param cb callback to map wrapped value
   */
  public andThen<U>(cb: (value: T) => Option<U>): Option<U> {
    return this.isSome
      ? cb(this.value)
      : <Option<U>><any>this; // None()
  }

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * #### Examples:
   * ```ts
   * const x = Some(2);
   * const y = None();
   * assert.deepEqual(x.or(y), Some(2));
   *
   * const x = None();
   * const y = Some(100);
   * assert.deepEqual(x.or(y), Some(100));
   *
   * const x = Some(2);
   * const y = Some(100);
   * assert.deepEqual(x.or(y), Some(2));
   *
   * const x: Option<number> = None();
   * const y = None();
   * assert.deepEqual(x.or(y), None());
   * ```
   *
   * @param optb another option
   */
  public or(optb: Option<T>): Option<T> {
    return this.isSome
      ? this
      : optb;
  }

  /**
   * Returns the option if it contains a value, otherwise calls `cb` and returns the result.
   *
   * #### Examples:
   * ```ts
   * const nobody: () => Option<string> = () => None();
   * const vikings: () => Option<string> = () => Some("vikings");
   *
   * assert.deepEqual(Some("barbarians").orElse(vikings), Some("barbarians"));
   * assert.deepEqual(None().orElse(vikings), Some("vikings"));
   * assert.deepEqual(None().orElse(nobody), None);
   * ```
   *
   * @param cb callback to calculate default option
   */
  public orElse(cb: () => Option<T>): Option<T> {
    return this.isSome
      ? this
      : cb();
  }
}
