export interface Match {
  match<T extends {}, U>(matcher: T): U;
}
