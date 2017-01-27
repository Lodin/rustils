import {Some, None, Option} from './option';
import {Match} from './match';

export type ResultMatcher<T, E> = {
  Ok: <A>(value: T) => A,
  Err: <B>(err: E) => B
};

export const Ok = <T>(value: T) => new Result(value, null);
export const Err = <E>(value: E) => new Result(null, value);

export class Result<T, E> implements Match<ResultMatcher<T, E>> {
  public constructor(protected value: T, protected error: E) {}

  public get ok(): Option<T> {
    return this.isOk
      ? Some(this.value)
      : None();
  }

  public get err(): Option<E> {
    return this.isErr
      ? Some(this.error)
      : None();
  }

  public get isOk(): boolean {
    return !!this.ok;
  }

  public get isErr(): boolean {
    return !!this.error;
  }

  public map<U>(cb: (value: T) => U): Result<U, E> {
    return this.isOk
      ? Ok(cb(this.value))
      : <Result<U, E>><any>this; // Err(this.error)
  }

  public mapErr<F>(cb: (error: E) => F): Result<T, F> {
    return this.isErr
      ? <Result<T, F>><any>this // Ok(this.value)
      : Err(cb(this.error));
  }

  public match<U>(matcher: ResultMatcher<T, E>): U {
    return this.isOk
      ? <U>matcher.Ok(this.value)
      : <U>matcher.Err(this.error);
  }

  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.isOk
      ? res
      : <Result<U, E>><any>this; // Err(this.error)
  }

  public andThen<U>(cb: (value: T) => Result<U, E>): Result<U, E> {
    return this.isOk
      ? cb(this.value)
      : <Result<U, E>><any>this;
  }

  public or<F>(res: Result<T, F>): Result<T, F> {
    return this.isOk
      ? <Result<T, F>><any>this
      : res;
  }

  public orElse<F>(cb: (error: E) => Result<T, F>): Result<T, F> {
    return this.isOk
      ? <Result<T, F>><any>this
      : cb(<E>this.error);
  }

  public unwrapOr(optb: T): T {
    return this.isOk
      ? this.value
      : optb;
  }

  public unwrapOrElse(cb: (error: E) => T) {
    return this.isOk
      ? this.value
      : cb(this.error);
  }

  public unwrap(): T {
    if (this.isOk) {
      return this.value;
    }

    throw this.error;
  }

  public unwrapErr(): E {
    if (this.isErr) {
      return this.error;
    }

    throw this.value;
  }

  public expect(msg: string): T {
    if (this.isOk) {
      return this.value;
    }

    throw new Error(`${msg}: ${this.error.toString()}`)
  }
}
