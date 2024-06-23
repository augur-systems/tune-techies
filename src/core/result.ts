enum ResultType {
  Ok,
  Fail,
}

interface ResultHandler<V, E, U> {
  ok: (value: V) => U
  fail: (error: E) => U
}

/**
 * Result is a type that represents either a successful value (Ok) or a failure (Fail).
 * It provides methods for functional programming, such as mapping over values and errors,
 * handling results with handlers, and peeking at values and errors.
 */
export abstract class Result<V, E> {
  static ok<V, E>(value: V): Result<V, E> {
    return new Ok(value)
  }

  static fail<V, E>(error: E): Result<V, E> {
    return new Fail(error)
  }

  protected constructor(private readonly type: ResultType) {}

  /**
   * Checks if the result is Ok.
   * @returns True if the result is Ok, otherwise false.
   */
  abstract isOk(): boolean

  /**
   * Maps the value in Ok case.
   * @param fn Function to map the value.
   * @returns A new Result with the mapped value.
   */
  abstract map<U>(fn: (value: V) => U): Result<U, E>

  /**
   * Maps the error in Fail case.
   * @param fn Function to map the error.
   * @returns A new Result with the mapped error.
   */
  abstract mapError<F>(fn: (error: E) => F): Result<V, F>

  /**
   * Handles the result with the provided handler.
   * @param handler Handler to process the result.
   * @returns The result of the handler.
   */
  abstract handle<U>(handler: ResultHandler<V, E, U>): U

  /**
   * Peeks at the value or error without transforming the result.
   * @param handler Handler to process the value or error.
   * @returns The original result.
   */
  abstract peek(handler: ResultHandler<V, E, void>): Result<V, E>

  /**
   * Chains the result.
   * @param fn Function to chain the value.
   * @returns A new Result after applying the chain function.
   */
  abstract flatMap<U>(fn: (value: V) => Result<U, E>): Result<U, E>

  /**
   * Returns the value if Ok, otherwise returns the default value.
   * @param defaultValue The default value to return in Fail case.
   * @returns The value in Ok case or the default value.
   */
  abstract getOrElse(defaultValue: V): V

  /**
   * Converts the Result to a string representation for debugging.
   * @returns A string representation of the Result.
   */
  abstract toString(): string
}

class Ok<V, E> extends Result<V, E> {
  constructor(private readonly value: V) {
    super(ResultType.Ok)
  }

  isOk(): boolean {
    return true
  }

  map<U>(fn: (value: V) => U): Result<U, E> {
    return new Ok(fn(this.value))
  }

  mapError<F>(_: (error: E) => F): Result<V, F> {
    return this as unknown as Result<V, F>
  }

  handle<U>(handler: ResultHandler<V, E, U>): U {
    return handler.ok(this.value)
  }

  peek(effect: ResultHandler<V, E, void>): Result<V, E> {
    effect.ok(this.value)
    return this
  }

  flatMap<U>(fn: (value: V) => Result<U, E>): Result<U, E> {
    return fn(this.value)
  }

  getOrElse(_: V): V {
    return this.value
  }

  toString(): string {
    return `Ok(${this.value})`
  }
}

class Fail<V, E> extends Result<V, E> {
  constructor(private readonly error: E) {
    super(ResultType.Fail)
  }

  isOk(): boolean {
    return false
  }

  map<U>(_: (value: V) => U): Result<U, E> {
    return this as unknown as Result<U, E>
  }

  mapError<F>(fn: (error: E) => F): Result<V, F> {
    return new Fail(fn(this.error))
  }

  handle<U>(handler: ResultHandler<V, E, U>): U {
    return handler.fail(this.error)
  }

  peek(effect: ResultHandler<V, E, void>): Result<V, E> {
    effect.fail(this.error)
    return this
  }

  flatMap<U>(_: (value: V) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>
  }

  getOrElse(defaultValue: V): V {
    return defaultValue
  }

  toString(): string {
    return `Fail(${this.error})`
  }
}
