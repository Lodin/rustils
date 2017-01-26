export interface Match<T> {
  match<U>(matcher: T): U;
}
