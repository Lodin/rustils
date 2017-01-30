/**
 * @module match
 */ /** for typedoc */

export interface Match {
  /**
   * Matches instance to the received matcher and executes appropriate branch.
   * @param matcher an object to perform pattern matching
   */
  match<T extends {}, U>(matcher: T): U;
}
