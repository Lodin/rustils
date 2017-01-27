import {Match} from './match';
import {Result, Ok, Err} from './result';

export type OptionMatcher<T> = {
  Some: <A>(value: T) => A,
  None: <B>() => B
};

export const Some = <T>(value: T) => new Option(value);
export const None = () => new Option(null);

export class Option<T> implements Match<OptionMatcher<T>> {
  constructor(protected value: T) {}

  public get isSome(): boolean {
    return !!this.value;
  }

  public get isNone(): boolean {
    return !this.value;
  }

  public expect(str: string): T {
    if (this.isSome) {
      return this.value;
    }

    throw new Error(str);
  }

  public unwrap(): T {
    if (this.isSome) {
      return this.value;
    }

    throw new Error();
  }

  public unwrapOr(def: T): T {
    return this.isSome
      ? this.value
      : def;
  }

  public unwrapOrElse(cb: () => T): T {
    return this.isSome
      ? this.value
      : cb();
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    return this.isSome
      ? Some(cb(this.value))
      : <Option<U>><any>this; // None()
  }

  public mapOr<U>(def: U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(this.value)
      : def;
  }

  public mapOrElse<U>(def: () => U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(this.value)
      : def();
  }

  public match<U>(matcher: OptionMatcher<T>): U {
    return this.isSome
      ? <U>matcher.Some(this.value)
      : <U>matcher.None();
  }

  public okOr<E>(err: E): Result<T, E> {
    return this.isSome
      ? Ok(this.value)
      : Err(err);
  }

  public okOrElse<E>(err: () => E): Result<T, E> {
    return this.isSome
      ? Ok(this.value)
      : Err(err());
  }

  public and<U>(optb: Option<U>): Option<U> {
    return this.isSome
      ? optb
      : <Option<U>><any>this; // None()
  }

  public andThen<U>(cb: (value: T) => U): Option<U> {
    return this.isSome
      ? Some(cb(this.value))
      : <Option<U>><any>this; // None()
  }

  public or(optb: Option<T>): Option<T> {
    return this.isSome
      ? this
      : optb;
  }

  public orElse(cb: () => Option<T>): Option<T> {
    return this.isSome
      ? this
      : cb();
  }
}
