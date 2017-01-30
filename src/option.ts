/**
 * Type [[Option]] represents an optional value: every [[Option]] is either [[Some]] and contains
 * a value, or [[None]], and does not. It can be a useful substitute for `null` due to it's
 * functional nature that brings less errors and needs less checks.
 *
 * ```ts
 * function divide(numerator: number, denominator: number) => Option<number> {
 *   return denominator == 0.0
 *    ? None()
 *    : Some(numerator / denominator);
 * }
 *
 * // The return value of the function is an option
 * const result = divide(2.0, 3.0);
 *
 * // Pattern match to retrieve the value
 * result.match({
 *   // The division was valid
 *   Some: x => console.log('Result: ', x),
 *   // The division was invalid
 *   None: () => console.log('Cannot divide by 0'),
 * });
 * ```
 * #### Examples
 * Basic pattern matching on [[Option]]:
 *
 * ```ts
 * const msg = Some('howdy');
 *
 * // Get the value contained by option
 * const unwrappedMsg = msg.unwrapOr('default message');
 * ```
 * Initialize a result to [[None]] before a loop:
 *
 * ```ts
 * type Kingdom = {type: 'Plant'|'Animal', size: number, name: string};
 *
 * const allTheBigThings: [Kingdom] = [
 *   {type: 'Plant', size: 250, name: 'redwood'},
 *   {type: 'Plant', size: 230, name: 'noble fir'},
 *   {type: 'Plant', size: 229, name: 'sugar pine'},
 *   {type: 'Animal', size: 25, name: 'blue whale'},
 *   {type: 'Animal', size: 19, name: 'fin whale'},
 *   {type: 'Animal', size: 15, name: 'north pacific right whale'}
 * ];
 *
 * // We're going to search for the name of the biggest animal,
 * // but to start with we've just got `None`.
 * let nameOfBiggestAnimal: Option<string> = None();
 * let sizeOfBiggestAnimal = 0;
 *
 * for (const {type, size, name} of allTheBigThings) {
 *    if (type === 'Plant') {
 *      continue;
 *    }
 *
 *    if (size > sizeOfBiggestAnimal) {
 *      sizeOfBiggestAnimal = size;
 *      nameOfBiggestAnimal = Some(name);
 *    }
 * }
 *
 * nameOfBiggestAnimal.match({
 *   Some: name => console.log(`the biggest animal is ${name}`);
 *   None: () => console.log('there are no animals :(');
 * });
 * ```
 *
 * @module option
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
 * Creates an [[Option]] containing some value.
 *
 * #### Examples
 * Basic usage:
 * ```ts
 * const x = Some(15);
 * assert(x instanceof Option);
 * assert.equal(x.unwrap(), 15);
 * ```
 * @param value a value [[Option]] will wrap over.
 * @constructor
 */
export const Some = <T>(value: T) => new Option<T>(value, true);

/**
 * Creates an [[Option]] containing no value.
 *
 * **Note:** if you want strong typing define the [[Option]] type for variable the [[Option]] will
 * be assigned, otherwise it will be `Option<any>`.
 *
 * #### Examples
 * Basic usage:
 * ```ts
 * const x: Option<number> = None();
 * assert(x instanceof Option);
 * ```
 * @constructor
 */
export const None = () => new Option<any>(null, false);

/**
 * The `Option` type. See the [[option]] module documentation for more.
 */
export class Option<T> implements Match {
  constructor(protected value: T, protected hasSome: boolean) {}

  /**
   * Gets `true` if the option is a `Some` value.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Option<number> = Some(2);
   * assert.equal(x.isSome, true);
   *
   * const y: Option<number> = None();
   * assert.equal(y.isSome, false);
   * ```
   */
  public get isSome(): boolean {
    return this.hasSome;
  }

  /**
   * Gets `true` if the option is a `None` value.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Option<number> = Some(2);
   * assert.equal(x.isNone, false);
   *
   * const y: Option<number> = None();
   * assert.equal(y.isNone, true);
   * ```
   */
  public get isNone(): boolean {
    return !this.hasSome;
  }

  /**
   * Unwraps an option, yielding the content of a `Some`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x = Some('value');
   * assert.equal(x.expect('the world is ending'), 'value');
   *
   * const y: Option<string> = None();
   * y.expect('the world is ending'); // throws an error with `the world is ending`
   * ```
   *
   * #### Throws
   * Throws an error if the value is a `None` with a custom error message provided by `msg`.
   *
   * @param msg custom error message
   */
  public expect(msg: string): T {
    if (this.hasSome) {
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
   * #### Examples
   * Basic usage:
   * ```ts
   * const x = Some('air');
   * assert.equal(x.unwrap(), 'air');
   *
   * const y: Option<string> = None();
   * assert.equal(y.unwrap(), 'air'); // fails
   * ```
   *
   * #### Throws
   * Throws an error if the self value equals `None`.
   */
  public unwrap(): T {
    if (this.hasSome) {
      return this.value;
    }

    throw new Error();
  }

  /**
   * Returns the contained value or a default.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * assert.equal(Some('car').unwrapOr('bike'), 'car');
   * assert.equal(None().unwrapOr('bike'), 'bike');
   * ```
   *
   * @param def default value
   */
  public unwrapOr(def: T): T {
    return this.hasSome
      ? this.value
      : def;
  }

  /**
   * Returns the contained value or computes it from a closure.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const k = 10;
   * assert.equal(Some(4).unwrapOrElse(() => 2 * k), 4);
   * assert.equal(None().unwrapOrElse(() => 2 * k), 20);
   * ```
   *
   * @param cb callback to calculate default value
   */
  public unwrapOrElse(cb: () => T): T {
    return this.hasSome
      ? this.value
      : cb();
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.
   *
   * #### Examples
   * Basic usage:
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
    return this.hasSome
      ? Some(cb(this.value))
      : <Option<U>><any>this; // None()
  }

  /**
   * Applies a function to the contained value (if any), or returns a `def` (if not).
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x = Some('foo');
   * assert.equal(x.mapOr(42, v => v.length), 3);
   *
   * const y: Option<string> = None();
   * assert.equal(y.mapOr(42, v => v.length), 42);
   * ```
   *
   * @param def default value
   * @param cb callback to map wrapped value
   */
  public mapOr<U>(def: U, cb: (value: T) => U): U {
    return this.hasSome
      ? cb(this.value)
      : def;
  }

  /**
   * Applies a function to the contained value (if any), or computes a `def` (if not).
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const k = 21;
   *
   * const x = Some('foo');
   * assert.equal(x.mapOrElse(() => 2 * k, v => v.length), 3);
   *
   * const y: Option<string> = None();
   * assert.equal(y.mapOrElse(() => 2 * k, v => v.length), 42);
   * ```
   *
   * @param def callback to calculate default value
   * @param cb callback to map wrapped value
   */
  public mapOrElse<U>(def: () => U, cb: (value: T) => U): U {
    return this.hasSome
      ? cb(this.value)
      : def();
  }

  /**
   * Matches option to the received matcher and executes the appropriate branch.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1 = Some(45);
   *
   * const y1 = x1.match({
   *   Some: v => v + 5,
   *   None: () => 10
   * });
   *
   * assert.equal(y1, 50);
   *
   * const x2 = None();
   *
   * const y2 = x2.match({
   *   Some: v => v + 5,
   *   None: () => 10
   * });
   *
   * assert.equal(y2, 10);
   *
   * const x3 = Some('foo');
   *
   * x3.match({
   *   Some: v => console.log(v), // prints `foo`
   *   None: () => console.log('nothing')
   * });
   * ```
   *
   * @param matcher an object to perform pattern matching
   */
  public match<U>(matcher: OptionMatcher<T, U>): U {
    return this.hasSome
      ? matcher.Some(this.value)
      : matcher.None();
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None`
   * to `Err(err)`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x = Some('foo');
   * assert.deepEqual(x.okOr(0), Ok('foo'));
   *
   * const y: Option<string> = None();
   * assert.deepEqual(y.okOr(0), Err(0));
   * ```
   *
   * @param err custom error value
   */
  public okOr<E>(err: E): Result<T, E> {
    return this.hasSome
      ? Ok(this.value)
      : Err(err);
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None`
   * to `Err(err())`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x = Some('foo');
   * assert.deepEqual(x.okOrElse(() => 0), Ok('foo'));
   *
   * const y: Option<string> = None();
   * assert.deepEqual(y.okOrElse(() => 0), Err(0));
   * ```
   *
   * @param err callback to calculate custom error value
   */
  public okOrElse<E>(err: () => E): Result<T, E> {
    return this.hasSome
      ? Ok(this.value)
      : Err(err());
  }

  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1 = Some(2);
   * const y1: Option<string> = None();
   * assert.deepEqual(x1.and(y1), None());
   *
   * const x2: Option<number> = None();
   * const y2 = Some('foo');
   * assert.deepEqual(x2.and(y2), None());
   *
   * const x3 = Some(2);
   * const y3 = Some('foo');
   * assert.deepEqual(x3.and(y3), Some('foo'));
   *
   * const x4: Option<number> = None();
   * const y4: Option<string> = None();
   * assert.deepEqual(x4.and(y4), None());
   * ```
   *
   * @param optb another option
   */
  public and<U>(optb: Option<U>): Option<U> {
    return this.hasSome
      ? optb
      : <Option<U>><any>this; // None()
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `cb` with the wrapped value and
   * returns the result.
   *
   * Some languages call this operation flatmap.
   *
   * #### Examples
   * Basic usage:
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
    return this.hasSome
      ? cb(this.value)
      : <Option<U>><any>this; // None()
  }

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1 = Some(2);
   * const y1 = None();
   * assert.deepEqual(x1.or(y1), Some(2));
   *
   * const x2 = None();
   * const y2 = Some(100);
   * assert.deepEqual(x2.or(y2), Some(100));
   *
   * const x3 = Some(2);
   * const y3 = Some(100);
   * assert.deepEqual(x3.or(y3), Some(2));
   *
   * const x4: Option<number> = None();
   * const y4 = None();
   * assert.deepEqual(x4.or(y4), None());
   * assert.deepEqual(x4.or(y4), None());
   * ```
   *
   * @param optb another option
   */
  public or(optb: Option<T>): Option<T> {
    return this.hasSome
      ? this
      : optb;
  }

  /**
   * Returns the option if it contains a value, otherwise calls `cb` and returns the result.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const nobody: () => Option<string> = () => None();
   * const vikings: () => Option<string> = () => Some('vikings');
   *
   * assert.deepEqual(Some('barbarians').orElse(vikings), Some('barbarians'));
   * assert.deepEqual(None().orElse(vikings), Some('vikings'));
   * assert.deepEqual(None().orElse(nobody), None());
   * ```
   *
   * @param cb callback to calculate default option
   */
  public orElse(cb: () => Option<T>): Option<T> {
    return this.hasSome
      ? this
      : cb();
  }
}
