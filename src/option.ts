import {Match} from './match';
import {Result, Ok, Err} from './result';

export type OptionMatcher<T> = {
  Some: <A>(value: T) => A,
  None: <B>() => B
};

export const Some = <T>(value: T) => new Option(value);
export const None = () => new Option(null);

export class Option<T> implements Match<OptionMatcher<T>> {
  constructor(protected value?: T|null) {}

  public get isSome(): boolean {
    return !!this.value;
  }

  public get isNone(): boolean {
    return !this.value;
  }

  public expect(str: string): T {
    if (this.isSome) {
      return <T>this.value;
    }

    throw new Error(str);
  }

  public unwrap(): T {
    if (this.isSome) {
      return <T>this.value;
    }

    throw new Error();
  }

  public unwrapOr(def: T): T {
    return this.isSome
      ? <T>this.value
      : def;
  }

  public unwrapOrElse(cb: () => T): T {
    return this.isSome
      ? <T>this.value
      : cb();
  }

  public map<U>(cb: (value: T) => U): Option<U|null> {
    return this.isSome
      ? Some(cb(<T>this.value))
      : <Option<null>><any>this; // None()
  }

  public mapOr<U>(def: U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(<T>this.value)
      : def;
  }

  public mapOrElse<U>(def: () => U, cb: (value: T) => U): U {
    return this.isSome
      ? cb(<T>this.value)
      : def();
  }

  public match<U>(matcher: OptionMatcher<T>): U {
    return this.isSome
      ? <U>matcher.Some(<T>this.value)
      : <U>matcher.None();
  }

  public okOr<E>(err: E): Result<T|null, E|null> {
    return this.isSome
      ? Ok(<T>this.value)
      : Err(err);
  }

  public okOrElse<E>(err: () => E): Result<T|null, E|null> {
    return this.isSome
      ? Ok(<T>this.value)
      : Err(err());
  }

  public and<U>(optb: Option<U|null>): Option<U|null> {
    return this.isSome
      ? optb
      : <Option<null>><any>this; // None()
  }

  public andThen<U>(cb: (value: T) => U): Option<U|null> {
    return this.isSome
      ? Some(cb(<T>this.value))
      : <Option<null>><any>this; // None()
  }

  public or(optb: Option<T|null>): Option<T|null> {
    return this.isSome
      ? this
      : optb;
  }

  public orElse(cb: () => Option<T|null>): Option<T|null> {
    return this.isSome
      ? this
      : cb();
  }
}
