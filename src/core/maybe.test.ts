import { Maybe } from './maybe'

describe('Maybe', () => {
  describe('Maybe Monad', () => {
    describe('Factories', () => {
      it('should create a Just value', () => {
        const maybe = Maybe.just(42)
        expect(maybe.isJust()).toBe(true)
        expect(maybe.getOrElse(0)).toBe(42)
      })

      it('should create a Nothing value', () => {
        const maybe = Maybe.nothing<number>()
        expect(maybe.isJust()).toBe(false)
        expect(maybe.getOrElse(0)).toBe(0)
      })
    })

    describe('Functor Laws', () => {
      it('should satisfy identity', () => {
        const justValue = Maybe.just(42)
        expect(justValue.map((x) => x)).toEqual(justValue)

        const nothingValue = Maybe.nothing<number>()
        expect(nothingValue.map((x) => x)).toEqual(nothingValue)
      })

      it('should satisfy composition', () => {
        const justValue = Maybe.just(42)
        const f = (x: number) => x + 1
        const g = (x: number) => x * 2

        expect(justValue.map((x) => g(f(x)))).toEqual(justValue.map(f).map(g))

        const nothingValue = Maybe.nothing<number>()
        expect(nothingValue.map((x) => g(f(x)))).toEqual(
          nothingValue.map(f).map(g)
        )
      })
    })

    describe('Monad Laws', () => {
      it('should satisfy left identity', () => {
        const f = (x: number) => Maybe.just(x + 1)
        expect(Maybe.just(42).flatMap(f)).toEqual(f(42))
      })

      it('should satisfy right identity', () => {
        const justValue = Maybe.just(42)
        expect(justValue.flatMap(Maybe.just)).toEqual(justValue)

        const nothingValue = Maybe.nothing<number>()
        expect(nothingValue.flatMap(Maybe.just)).toEqual(nothingValue)
      })

      it('should satisfy associativity', () => {
        const f = (x: number) => Maybe.just(x + 1)
        const g = (x: number) => Maybe.just(x * 2)

        const justValue = Maybe.just(42)
        expect(justValue.flatMap(f).flatMap(g)).toEqual(
          justValue.flatMap((x) => f(x).flatMap(g))
        )

        const nothingValue = Maybe.nothing<number>()
        expect(nothingValue.flatMap(f).flatMap(g)).toEqual(
          nothingValue.flatMap((x) => f(x).flatMap(g))
        )
      })
    })
  })
  describe('map', () => {
    it('should transform the value in Just case', () => {
      const maybe = Maybe.just(42).map((x) => x + 1)
      expect(maybe.getOrElse(0)).toBe(43)
    })

    it('should not transform the value in Nothing case', () => {
      const maybe = Maybe.nothing<number>().map((x) => x + 1)
      expect(maybe.getOrElse(0)).toBe(0)
    })
  })

  describe('peek', () => {
    it('should process Just value without changing it', () => {
      const maybe = Maybe.just(42)
      let peekedValue: number | null = null
      maybe.peek((value) => {
        peekedValue = value
      })
      expect(peekedValue).toBe(42)
      expect(maybe.getOrElse(0)).toBe(42)
    })

    it('should not process Nothing value', () => {
      const maybe = Maybe.nothing<number>()
      let peekedValue: number | null = null
      maybe.peek((value) => {
        peekedValue = value
      })
      expect(peekedValue).toBe(null)
      expect(maybe.getOrElse(0)).toBe(0)
    })
  })

  describe('flatMap', () => {
    it('should chain Just values', () => {
      const maybe = Maybe.just(42)
        .flatMap((value) => Maybe.just(value + 1))
        .flatMap((value) => Maybe.just(value * 2))
      expect(maybe.getOrElse(0)).toBe(86)
    })

    it('should stop at first Nothing value', () => {
      const maybe = Maybe.just(42)
        .flatMap(() => Maybe.nothing<number>())
        .flatMap((value) => Maybe.just(value * 2))
      expect(maybe.getOrElse(0)).toBe(0)
    })
  })

  describe('filter', () => {
    it('should return Just if predicate is true', () => {
      const maybe = Maybe.just(42)
      const result = maybe.filter((x) => x > 40)
      expect(result.isJust()).toBe(true)
      expect(result.getOrElse(0)).toBe(42)
    })

    it('should return Nothing if predicate is false', () => {
      const maybe = Maybe.just(42)
      const result = maybe.filter((x) => x < 40)
      expect(result.isJust()).toBe(false)
      expect(result.getOrElse(0)).toBe(0)
    })

    it('should return Nothing for Nothing case', () => {
      const maybe = Maybe.nothing<number>()
      const result = maybe.filter((x) => x > 40)
      expect(result.isJust()).toBe(false)
      expect(result.getOrElse(0)).toBe(0)
    })
  })

  describe('getOrElse', () => {
    it('should return the value in Just case', () => {
      const maybe = Maybe.just(42)
      expect(maybe.getOrElse(0)).toBe(42)
    })

    it('should return the default value in Nothing case', () => {
      const maybe = Maybe.nothing<number>()
      expect(maybe.getOrElse(0)).toBe(0)
    })
  })

  describe('isJust', () => {
    it('should return true for Just value', () => {
      const maybe = Maybe.just(42)
      expect(maybe.isJust()).toBe(true)
    })

    it('should return false for Nothing value', () => {
      const maybe = Maybe.nothing<number>()
      expect(maybe.isJust()).toBe(false)
    })
  })

  describe('equals', () => {
    it('should return true for equal Just values', () => {
      const maybe1 = Maybe.just(42)
      const maybe2 = Maybe.just(42)
      expect(maybe1.equals(maybe2)).toBe(true)
    })

    it('should return false for different Just values', () => {
      const maybe1 = Maybe.just(42)
      const maybe2 = Maybe.just(43)
      expect(maybe1.equals(maybe2)).toBe(false)
    })

    it('should return true for equal Nothing values', () => {
      const maybe1 = Maybe.nothing<number>()
      const maybe2 = Maybe.nothing<number>()
      expect(maybe1.equals(maybe2)).toBe(true)
    })

    it('should return false for different Nothing values', () => {
      const maybe1 = Maybe.nothing<number>()
      const maybe2 = Maybe.just(42)
      expect(maybe1.equals(maybe2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string representation of Just value', () => {
      const maybe = Maybe.just(42)
      expect(maybe.toString()).toBe('Just(42)')
    })

    it('should return the string representation of Nothing value', () => {
      const maybe = Maybe.nothing<number>()
      expect(maybe.toString()).toBe('Nothing')
    })
  })
})
