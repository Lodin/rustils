/**
 * [[Result]] is the type used for returning and propagating errors. It is a structure with the
 * variants, [[Ok]], representing success and containing a value, and [[Err]], representing error
 * and containing an error value. Functions return [[Result]] whenever errors are expected and
 * recoverable.
 *
 * A simple function returning [[Result]] might be defined and used like so:
 * ```ts
 * enum Version { Version1, Version2 }
 *
 * function parseVersion(header: [number]): Result<Version, string> {
 *   switch (header[0]) {
 *     case undefined:
 *       return Err('invalid header length');
 *     case 1:
 *       return Ok(Version.Version1);
 *     case 2:
 *       return Ok(Version.Version2);
 *     default:
 *       return Err('invalid version');
 *   }
 * }
 *
 * let version = parseVersion([1, 2, 3, 4]);
 * version.match({
 *   Ok: v => console.log(`working with version: ${v}`),
 *   Err: e => console.log(`error parsing header: ${e}`),
 * });
 * ```
 * Pattern matching on [[Result]]s is clear and straightforward for simple cases, but [[Result]]
 * comes with some convenience methods that make working with it more succinct.
 * ```ts
 * const goodResult: Result<number, number> = Ok(10);
 * const badResult: Result<number, number> = Err(10);
 *
 * // The `isOk` and `isErr` methods do what they say.
 * assert(goodResult.isOk && !goodResult.isErr);
 * assert(badResult.isErr && !badResult.isOk);
 *
 * // `map` consumes the `Result` and produces another.
 * const goodResult2: Result<number, number> = goodResult.map(i => i + 1);
 * const badResult2: Result<number, number> = badResult.map(i => i - 1);
 *
 * // Use `andThen` to continue the computation.
 * const goodResult3: Result<boolean, number> = goodResult2.andThen(i => Ok(i === 11));
 *
 * // Use `orElse` to handle the error.
 * const badResult3: Result<number, number> = badResult2.orElse(i => Ok(i + 20));
 *
 * // Consume the result and return the contents with `unwrap`.
 * const finalAwesomeResult = goodResult3.unwrap();
 * ```
 *
 * @module result
 */ /** for typedoc */

import {Some, None, Option} from './option';
import {Match} from './match';

/**
 * Object contains pattern matching functions for an [[Result]].
 *
 * This object should be sent as argument to the [[Result.match]] method.
 */
export type ResultMatcher<T, E, U> = {
  Ok: (value: T) => U,
  Err: (err: E) => U
};

/**
 * Creates a [[Result]] containing success value.
 *
 * **Note:** If you want strong typing define the `Result` type for variable the `Result` will be
 * assigned, otherwise it will be `Result<T, any>`;
 *
 * #### Examples:
 * ```ts
 * const x: Result<number, string> = Ok(10);
 * assert(x instanceof Result);
 * assert.equal(x.unwrap(), 10);
 * ```
 *
 * @param value
 * @constructor
 */
export const Ok = <T>(value: T) => new Result<T, any>(value, null, true);

/**
 * Creates a [[Result]] containing error value.
 *
 * **Note:** If you want strong typing define the `Result` type for variable the `Result` will be
 * assigned, otherwise it will be `Result<any, T>`;
 *
 * #### Examples:
 * ```ts
 * const x: Result<number, string> = Err('something went wrong');
 * assert(x instanceof Result);
 * assert.equal(x.unwrapErr(), 'something went wrong');
 * ```
 *
 * @param error
 * @constructor
 */
export const Err = <E>(error: E) => new Result<any, E>(null, error, false);

/**
 * `Result` is a type that represents either success (`Ok`) or failure (`Err`).
 *
 * See the [[result]] module documentation for details.
 */
export class Result<T, E> implements Match {
  public constructor(protected value: T, protected error: E, protected hasOk: boolean) {}

  /**
   * Converts from `Result<T, E>` to [[Option]]<T>.
   *
   * Converts result into an [[Option]]<T>, consuming result, and discarding the error, if any.
   *
   * #### Examples:
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(2);
   * assert.equal(x.ok, Some(2));
   *
   * const x: Result<number, string> = Err('Nothing here');
   * assert.equal(x.ok, None());
   * ```
   */
  public get ok(): Option<T> {
    return this.hasOk
      ? Some(this.value)
      : None();
  }

  /**
   * Converts from `Result<T, E>` to [[Option]]<E>.
   *
   * Converts result into an [[Option]]<E>, consuming result, and discarding the success value,
   * if any.
   *
   * #### Examples:
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(2);
   * assert.equal(x.err, None());
   *
   * const x: Result<number, string> = Err('Nothing here');
   * assert.equal(x.err, Some('Nothing here'));
   * ```
   */
  public get err(): Option<E> {
    return !this.hasOk
      ? Some(this.error)
      : None();
  }

  /**
   * Returns `true` if the result is `Ok`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(-3);
   * assert.equal(x.isOk, true);
   *
   * const x: Result<number, string> = Err('Some error message');
   * assert.equal(x.isOk, false);
   * ```
   */
  public get isOk(): boolean {
    return this.hasOk;
  }

  /**
   * Returns `true` if the result is `Err`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(-3);
   * assert.equal(x.isErr, false);
   *
   * const x: Result<number, string> = Err('Some error message');
   * assert.equal(x.isErr, true);
   * ```
   */
  public get isErr(): boolean {
    return !this.hasOk;
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
   * leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * #### Examples
   * Print the numbers on each line of a string multiplied by two.
   * ```ts
   * let line = '1\n2\n3\n4\n';
   *
   * const parse = (num: string): Result<number, string> => {
   *   const parsed = parseInt(num, 10);
   *   return parsed
   *     ? Ok(parsed)
   *     : Err('error');
   * };
   *
   * for (const num of line.split('\n')) {
   *   parse(num).map(i => i * 2).match({
   *     Ok: v => console.log(v),
   *     Err: () => {}
   *   });
   * }
   * ```
   *
   * @param cb callback to map wrapped value
   */
  public map<U>(cb: (value: T) => U): Result<U, E> {
    return this.hasOk
      ? Ok(cb(this.value))
      : <Result<U, E>><any>this; // Err(this.error)
  }

  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
   * leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const stringify = (x: number) => `error code: ${x}`;
   *
   * const x: Result<number, number> = Ok(2);
   * assert.equal(x.mapErr(stringify), Ok(2));

   * const y: Result<number, number> = Err(13);
   * assert.equal(y.mapErr(stringify), Err('error code: 13'));
   * ```
   *
   * @param cb callback to map error value
   */
  public mapErr<F>(cb: (error: E) => F): Result<T, F> {
    return this.hasOk
      ? <Result<T, F>><any>this // Ok(this.value)
      : Err(cb(this.error));
  }

  /**
   * Matches result to the received matcher and executes appropriate branch.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1 = Ok(10);
   *
   * const y1 = x1.match({
   *   Ok: v => v + 10,
   *   Err: () => 100
   * });
   *
   * assert.equal(y1, 20);
   *
   * const x2 = Err('error');
   *
   * const y2 = x2.match({
   *   Ok: v => v + 10,
   *   Err: () => 100
   * });
   *
   * assert.equal(y2, 100);
   *
   * const x3 = Err('error');
   *
   * x3.match({
   *   Ok: v => console.log(v),
   *   Err: e => console.log(e + 's') // prints "errors"
   * });
   * ```
   *
   * @param matcher an object to perform pattern matching
   */
  public match<U>(matcher: ResultMatcher<T, E, U>): U {
    return this.hasOk
      ? matcher.Ok(this.value)
      : matcher.Err(this.error);
  }

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value of self.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1: Result<number, string> = Ok(2);
   * const y1: Result<string, string> = Err('late error');
   * assert_eq!(x1.and(y1), Err('late error'));
   *
   * const x2: Result<number, string> = Err('early error');
   * const y2: Result<string, string> = Ok('foo');
   * assert.equal(x2.and(y2), Err('early error'));
   *
   * const x3: Result<number, string> = Err('not a 2');
   * const y3: Result<string, string> = Err('late error');
   * assert.equal(x3.and(y3), Err('not a 2'));
   *
   * const x4: Result<number, string> = Ok(2);
   * const y4: Result<string, string> = Ok('different result type');
   * assert.equal(x4.and(y4), Ok('different result type'));
   * ```
   *
   * @param res another result
   */
  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.hasOk
      ? res
      : <Result<U, E>><any>this; // Err(this.error)
  }

  /**
   * Calls `cb` if the result is `Ok`, otherwise returns the `Err` value of self.
   *
   * This function can be used for control flow based on Result values.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * type Fn = (x: number) => Result<number, number>
   * const sq: Fn = x => Ok(x * x);
   * const err: Fn = x => Err(x);
   *
   * assert.deepEqual(Ok(2).andThen(sq).andThen(sq), Ok(16));
   * assert.deepEqual(Ok(2).andThen(sq).andThen(err), Err(4));
   * assert.deepEqual(Ok(2).andThen(err).andThen(sq), Err(2));
   * assert.deepEqual(Err(3).andThen(sq).andThen(sq), Err(3));
   * ```
   *
   * @param cb callback to map wrapped value
   */
  public andThen<U>(cb: (value: T) => Result<U, E>): Result<U, E> {
    return this.hasOk
      ? cb(this.value)
      : <Result<U, E>><any>this;
  }

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value of self.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x1: Result<number, string> = Ok(2);
   * const y1: Result<number, string> = Err('late error');
   * assert.deepEqual(x1.or(y1), Ok(2));
   *
   * const x2: Result<number, string> = Err('early error');
   * const y2: Result<number, string> = Ok(2);
   * assert.deepEqual(x2.or(y2), Ok(2));
   *
   * const x3: Result<number, string> = Err('not a 2');
   * const y3: Result<number, string> = Err('late error');
   * assert.deepEqual(x3.or(y3), Err('late error'));
   *
   * const x4: Result<number, string> = Ok(2);
   * const y4: Result<number, string> = Ok(100);
   * assert.deepEqual(x4.or(y4), Ok(2));
   * ```
   *
   * @param res default result
   */
  public or<F>(res: Result<T, F>): Result<T, F> {
    return this.hasOk
      ? <Result<T, F>><any>this
      : res;
  }

  /**
   * Calls `cb` if the result is `Err`, otherwise returns the `Ok` value of self.
   *
   * This function can be used for control flow based on result values.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * type Fn = (x: number) => Result<number, number>
   * const sq: Fn = x => Ok(x * x);
   * const err: Fn = x => Err(x);
   *
   * assert.deepEqual(Ok(2).orElse(sq).orElse(sq), Ok(2));
   * assert.deepEqual(Ok(2).orElse(err).orElse(sq), Ok(2));
   * assert.deepEqual(Err(3).orElse(sq).orElse(err), Ok(9));
   * assert.deepEqual(Err(3).orElse(err).orElse(err), Err(3));
   * ```
   *
   * @param cb callback to calculate default result
   */
  public orElse<F>(cb: (error: E) => Result<T, F>): Result<T, F> {
    return this.hasOk
      ? <Result<T, F>><any>this
      : cb(this.error);
  }

  /**
   * Unwraps a result, yielding the content of an `Ok`. Else, it returns `optb`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const optb = 2;
   * const x: Result<number, string> = Ok(9);
   * assert.equal(x.unwrapOr(optb), 9);
   *
   * const y: Result<number, string> = Err("error");
   * assert.equal(y.unwrapOr(optb), optb);
   * ```
   *
   * @param optb default
   */
  public unwrapOr(optb: T): T {
    return this.hasOk
      ? this.value
      : optb;
  }

  /**
   * Unwraps a result, yielding the content of an `Ok`. If the value is an `Err` then it calls `cb`
   * with its value.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const count: (x: string) => number = x => x.length;
   *
   * assert.equal(Ok(2).unwrapOrElse(count), 2);
   * assert.equal(Err("foo").unwrapOrElse(count), 3);
   * ```
   *
   * @param cb callback to calculate default value
   */
  public unwrapOrElse(cb: (error: E) => T) {
    return this.hasOk
      ? this.value
      : cb(this.error);
  }

  /**
   * Unwraps a result, yielding the content of an `Ok`.
   *
   * #### Throws
   * Throws an error if the value is an `Err`, with a error message provided by the `Err`'s value.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(2);
   * assert.equal(x.unwrap(), 2);
   * ```
   * ```ts
   * const x: Result<number, string> = Err('emergency failure');
   * x.unwrap(); // fails with `emergency failure`
   * ```
   */
  public unwrap(): T {
    if (this.hasOk) {
      return this.value;
    }

    throw new Error(this.error.toString());
  }

  /**
   * Unwraps a result, yielding the content of an `Err`.
   *
   * #### Throws
   * Throws an error if the value is an `Ok`, with a custom error message provided by the `Ok`'s
   * value.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Ok(2);
   * x.unwrapErr(); // panics with `2`
   * ```
   * ```ts
   * const x: Result<number, string> = Err('emergency failure');
   * assert.equal(x.unwrapErr(), 'emergency failure');
   * ```
   */
  public unwrapErr(): E {
    if (this.isErr) {
      return this.error;
    }

    throw new Error(this.value.toString());
  }

  /**
   * Unwraps a result, yielding the content of an `Ok`.
   *
   * #### Throws
   * Throws an error if the value is an `Err`, with a error message including the passed message,
   * and the content of the `Err`.
   *
   * #### Examples
   * Basic usage:
   * ```ts
   * const x: Result<number, string> = Err('emergency failure');
   * x.expect('Testing expect'); // panics with `Testing expect: emergency failure`
   * ```
   *
   * @param msg additional custom error message
   */
  public expect(msg: string): T {
    if (this.hasOk) {
      return this.value;
    }

    throw new Error(`${msg}: ${this.error.toString()}`)
  }
}
