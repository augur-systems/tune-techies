import { Handler, Result } from './result'

describe('Result', () => {
  describe('Factories', () => {
    it('should create an Ok result', () => {
      const result = Result.ok(42)
      expect(result.isOk()).toBe(true)
      expect(result.getOrElse(0)).toBe(42)
    })

    it('should create a Fail result', () => {
      const result = Result.fail('error')
      expect(result.isOk()).toBe(false)
      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('Functor Laws', () => {
    it('should satisfy identity', () => {
      const okResult = Result.ok(42)
      expect(okResult.map((x) => x)).toEqual(okResult)

      const failResult = Result.fail('error')
      expect(failResult.map((x) => x)).toEqual(failResult)
    })

    it('should satisfy composition', () => {
      const okResult = Result.ok(42)
      const f = (x: number) => x + 1
      const g = (x: number) => x * 2

      expect(okResult.map((x) => g(f(x)))).toEqual(okResult.map(f).map(g))

      const failResult = Result.fail<number, string>('error')
      expect(failResult.map((x) => g(f(x)))).toEqual(failResult.map(f).map(g))
    })
  })

  describe('Monad Laws', () => {
    it('should satisfy left identity', () => {
      const f = (x: number) => Result.ok(x + 1)
      expect(Result.ok(42).flatMap(f)).toEqual(f(42))
    })
    it('should satisfy right identity', () => {
      const okResult = Result.ok(42)
      expect(okResult.flatMap(Result.ok)).toEqual(okResult)

      const failResult = Result.fail('error')
      expect(failResult.flatMap(Result.ok)).toEqual(failResult)
    })
    it('should satisfy associativity', () => {
      const f = (x: number) => Result.ok<number, string>(x + 1)
      const g = (x: number) => Result.ok<number, string>(x * 2)

      const okResult = Result.ok(42)
      expect(okResult.flatMap(f).flatMap(g)).toEqual(
        okResult.flatMap((x) => f(x).flatMap(g))
      )

      const failResult = Result.fail<number, string>('error')
      expect(failResult.flatMap(f).flatMap(g)).toEqual(
        failResult.flatMap((x) => f(x).flatMap(g))
      )
    })
  })

  describe('map', () => {
    it('map should transform the value in Ok case', () => {
      const result = Result.ok(42).map((x) => x + 1)
      expect(result.getOrElse(0)).toBe(43)
    })

    it('map should not transform the value in Fail case', () => {
      const result = Result.fail<number, string>('error').map((x) => x + 1)
      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('mapError', () => {
    it('mapError should transform the error in Fail case', () => {
      const result = Result.fail('error').mapError((e) => `new ${e}`)
      result.handle({
        ok: () => {},
        fail: (error) => {
          expect(error).toBe('new error')
        },
      })
    })

    it('mapError should not transform the error in Ok case', () => {
      const result = Result.ok(42).mapError((e) => `new ${e}`)
      expect(result.getOrElse(0)).toBe(42)
    })
  })

  describe('handle', () => {
    it('handle should process Ok result', () => {
      const result = Result.ok<number, string>(42)
      const handler: Handler<number, string, string> = {
        ok: (value) => `Value is ${value}`,
        fail: (error) => `Error is ${error}`,
      }
      expect(result.handle(handler)).toBe('Value is 42')
    })

    it('handle should process Fail result', () => {
      const result = Result.fail<number, string>('error')
      const handler: Handler<number, string, string> = {
        ok: (value) => `Value is ${value}`,
        fail: (error) => `Error is ${error}`,
      }
      expect(result.handle(handler)).toBe('Error is error')
    })
  })

  describe('peek', () => {
    it('peek should process Ok result without changing it', () => {
      const result = Result.ok(42)
      let peekedValue: number | null = null
      result.peek({
        ok: (value) => {
          peekedValue = value
        },
        fail: () => {},
      })
      expect(peekedValue).toBe(42)
      expect(result.getOrElse(0)).toBe(42)
    })

    it('peek should process Fail result without changing it', () => {
      const result = Result.fail('error')
      let peekedError: string | null = null
      result.peek({
        ok: () => {},
        fail: (error) => {
          peekedError = error
        },
      })
      expect(peekedError).toBe('error')
      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('flatMap', () => {
    it('flatMap should chain Ok results', () => {
      const result = Result.ok(42)
        .flatMap((value) => Result.ok(value + 1))
        .flatMap((value) => Result.ok(value * 2))

      expect(result.getOrElse(0)).toBe(86)
    })

    it('flatMap should stop at first Fail result', () => {
      const result = Result.ok<number, string>(42)
        .flatMap((_) => Result.fail<number, string>('error'))
        .flatMap((value) => Result.ok(value * 2))

      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('getOrElse', () => {
    it('getOrElse should return the value in Ok case', () => {
      const result = Result.ok(42)
      expect(result.getOrElse(0)).toBe(42)
    })

    it('getOrElse should return the default value in Fail case', () => {
      const result = Result.fail<number, string>('error')
      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('isOk', () => {
    it('isOk should return true in Ok case', () => {
      const result = Result.ok(42)
      expect(result.isOk()).toBe(true)
    })

    it('isOk should return false in Fail case', () => {
      const result = Result.fail('error')
      expect(result.isOk()).toBe(false)
    })
  })

  describe('toString', () => {
    it('toString should return the string representation of the Ok case', () => {
      const result = Result.ok(42)
      expect(result.toString()).toBe('Ok(42)')
    })

    it('toString should return the string representation of the Fail case', () => {
      const result = Result.fail('error')
      expect(result.toString()).toBe('Fail(error)')
    })
  })
})
