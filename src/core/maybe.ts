enum MaybeType {
  Just,
  Nothing,
}

interface MaybeHandler<V, U> {
  just: (value: V) => U
  nothing: () => U
}

/**
 * Maybe is a type that represents either a value (Just) or no value (Nothing).
 * It provides methods for functional programming, such as mapping over values,
 * handling results with handlers, and peeking at values.
 */
export abstract class Maybe<V> {
  /**
   * Factory method to create a new Maybe with a value wrapped in a Just.
   *
   * @param value nonnull and defined value to wrap in a Just
   * @returns a new Maybe with the value wrapped in a Just
   */
  static just<V>(value: V): Maybe<V> {
    return new Just(value)
  }

  /**
   * Factory method to create a new Maybe with no value in a Nothing.
   *
   * @returns a new Maybe with no value in a Nothing
   */
  static nothing<V>(): Maybe<V> {
    return new Nothing<V>()
  }

  protected constructor(private readonly type: MaybeType) {}

  /**
   * Checks if the Maybe is Just.
   * @returns True if the Maybe is Just, otherwise false.
   */
  abstract isJust(): boolean

  /**
   * Maps the value in Just case.
   * @param fn Function to map the value.
   * @returns A new Maybe with the mapped value.
   */
  abstract map<U>(fn: (value: V) => U): Maybe<U>

  /**
   * Peeks at the value without transforming the Maybe.
   * @param fn Function to process the value.
   * @returns The original Maybe.
   */
  abstract peek(fn: (value: V) => void): Maybe<V>

  /**
   * Chains the Maybe.
   * @param fn Function to chain the value.
   * @returns A new Maybe after applying the chain function.
   */
  abstract flatMap<U>(fn: (value: V) => Maybe<U>): Maybe<U>

  /**
   * Filters the value in Just case.
   * @param fn Predicate function to filter the value.
   * @returns A new Maybe with the value if it satisfies the predicate, otherwise Nothing.
   */
  abstract filter(fn: (value: V) => boolean): Maybe<V>

  /**
   * Returns the value if Just, otherwise returns the default value.
   * @param defaultValue The default value to return in Nothing case.
   * @returns The value in Just case or the default value.
   */
  abstract getOrElse(defaultValue: V): V

  /**
   * Handles the Maybe with the provided handler.
   * @param handler Handler to process the Maybe.
   * @returns The result of the handler.
   */
  abstract handle<U>(handler: MaybeHandler<V, U>): U

  /**
   * Compares the current Maybe with another Maybe for equality.
   * @param other The other Maybe to compare with.
   * @returns True if both Maybes are equal, otherwise false.
   */
  abstract equals(other: Maybe<V>): boolean

  /**
   * Converts the Maybe to a string representation for debugging.
   * @returns A string representation of the Maybe.
   */
  abstract toString(): string
}

class Just<V> extends Maybe<V> {
  constructor(private readonly value: V) {
    super(MaybeType.Just)
  }

  isJust(): boolean {
    return true
  }

  map<U>(fn: (value: V) => U): Maybe<U> {
    return new Just(fn(this.value))
  }

  peek(fn: (value: V) => void): Maybe<V> {
    fn(this.value)
    return this
  }

  flatMap<U>(fn: (value: V) => Maybe<U>): Maybe<U> {
    return fn(this.value)
  }

  filter(fn: (value: V) => boolean): Maybe<V> {
    return fn(this.value) ? this : new Nothing<V>()
  }

  getOrElse(_: V): V {
    return this.value
  }

  handle<U>(handler: MaybeHandler<V, U>): U {
    return handler.just(this.value)
  }

  equals(other: Maybe<V>): boolean {
    return other instanceof Just && this.value === other.value
  }

  toString(): string {
    return `Just(${this.value})`
  }
}

class Nothing<V> extends Maybe<V> {
  constructor() {
    super(MaybeType.Nothing)
  }

  isJust(): boolean {
    return false
  }

  map<U>(_: (value: V) => U): Maybe<U> {
    return new Nothing<U>()
  }

  peek(_: (value: V) => void): Maybe<V> {
    return this
  }

  flatMap<U>(_: (value: V) => Maybe<U>): Maybe<U> {
    return new Nothing<U>()
  }

  filter(_: (value: V) => boolean): Maybe<V> {
    return this
  }

  getOrElse(defaultValue: V): V {
    return defaultValue
  }

  handle<U>(handler: MaybeHandler<V, U>): U {
    return handler.nothing()
  }

  equals(other: Maybe<V>): boolean {
    return other instanceof Nothing
  }

  toString(): string {
    return `Nothing`
  }
}
