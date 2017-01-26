import {Some, None, Option} from './option';
import {Match} from './match';

export type ResultMatcher<T, E> = {
  Ok: <A>(value: T) => A,
  Err: <B>(err: E) => B
};

export const Ok = <T>(value: T) => new Result(value, null);
export const Err = <E>(value: E) => new Result(null, value);

export class Result<T, E> implements Match<ResultMatcher<T, E>> {
  public constructor(protected value: T|null, protected error: E|null) {}

  public get ok(): Option<T|null> {
    return this.isOk
      ? Some(this.value)
      : None();
  }

  public get err(): Option<E|null> {
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

  public map<U>(cb: (value: T) => U): Result<U|null, E|null> {
    return this.isOk
      ? Ok(cb(<T>this.value))
      : <Result<null, E>><any>this; // Err(this.error)
  }

  public mapErr<F>(cb: (error: E) => F): Result<T|null, F|null> {
    return this.isErr
      ? <Result<T, null>><any>this // Ok(this.value)
      : Err(cb(<E>this.error));
  }

  public match<U>(matcher: ResultMatcher<T, E>): U {
    return this.isOk
      ? <U>matcher.Ok(<T>this.value)
      : <U>matcher.Err(<E>this.error);
  }

  public and<U>(res: Result<U, E>): Result<U|null, E|null> {
    return this.isOk
      ? res
      : <Result<null, E>><any>this; // Err(this.error)
  }
}
