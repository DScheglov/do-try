import { describe, expect, it } from '@jest/globals';
import { Expect, Equal } from '@type-challenges/utils';
import doTry, {
  ErrValueTuple,
  UnknownError,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_REJECTED,
  ERR_NULLISH_VALUE_THROWN,
} from './index';
import DoTryError from './DoTryError';

describe('doTry', () => {
  it('handles synchronous functions', () => {
    const fn = () => 42;
    const result: ErrValueTuple<number> = doTry(fn);
    expect(result).toEqual([undefined, 42]);
  });

  it('correctly types the result of synchronous functions', () => {
    const result = doTry(() => 42);
    const check: Expect<Equal<typeof result, ErrValueTuple<number>>> = true;
    expect(check).toBeTruthy();
  });

  it('correctly types the result of synchronous functions that never returns', () => {
    const result = doTry(() => {
      throw new Error('Something went wrong');
    });
    const check: Expect<Equal<typeof result, Readonly<[UnknownError, never]>>> =
      true;
    expect(check).toBeTruthy();
  });

  it('correctly types the result of asynchronous functions that never returns', () => {
    const result = doTry(async () => {
      throw new Error('Something went wrong');
    });
    const check: Expect<
      Equal<typeof result, Promise<Readonly<[UnknownError, never]>>>
    > = true;
    expect(check).toBeTruthy();
  });

  it('correctly discriminates the result of synchronous functions (ok case)', () => {
    expect.assertions(2);
    const [error, value] = doTry(() => 42);

    if (error != null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const check: Expect<Equal<typeof error, UnknownError>> = true;
    } else {
      const check: Expect<Equal<typeof value, number>> = true;
      expect(check).toBeTruthy();
    }

    if (error == null) {
      const check: Expect<Equal<typeof value, number>> = true;
      expect(check).toBeTruthy();
    }
  });

  it('correctly discriminates the result of synchronous functions (error case)', () => {
    expect.assertions(2);
    const [error, value] = doTry((): number => {
      throw new Error('Something went wrong');
    });

    if (error != null) {
      const check: Expect<Equal<typeof error, UnknownError>> = true;
      expect(check).toBeTruthy();
    }

    if (error == null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const check: Expect<Equal<typeof value, number>> = true;
    } else {
      const check: Expect<Equal<typeof error, UnknownError>> = true;
      expect(check).toBeTruthy();
    }
  });

  it('correctly discriminates the result when function intentionally returns undefined', () => {
    expect.assertions(2);
    const [error, value] = doTry(() => undefined);

    if (error != null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const check: Expect<Equal<typeof error, UnknownError>> = true;
    } else {
      const check: Expect<Equal<typeof value, undefined>> = true;
      expect(check).toBeTruthy();
    }

    if (error == null) {
      const check: Expect<Equal<typeof value, undefined>> = true;
      expect(check).toBeTruthy();
    }
  });

  it('correctly discriminates the result when function intentionally returns T | undefined', () => {
    expect.assertions(2);
    const [error, value] = doTry((): number | undefined => 42);

    if (error != null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const check: Expect<Equal<typeof error, UnknownError>> = true;
    } else {
      const check: Expect<Equal<typeof value, number | undefined>> = true;
      expect(check).toBeTruthy();
    }

    if (error == null) {
      const check: Expect<Equal<typeof value, number | undefined>> = true;
      expect(check).toBeTruthy();
    }
  });

  it('handles synchronous functions that throw an error', () => {
    const fn = (): number => {
      throw new Error('Something went wrong');
    };
    const result: ErrValueTuple<number> = doTry(fn);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[1]).toBeUndefined();
  });

  it('handles asynchronous functions', async () => {
    const fn = async () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(42);
        }, 0);
      });
    };
    const result: Promise<ErrValueTuple<number>> = doTry(fn);
    await expect(result).resolves.toEqual([undefined, 42]);
  });

  it('handles asynchronous functions that reject', async () => {
    const fn = async () => {
      return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Something went wrong'));
        }, 0);
      });
    };
    const result: Promise<ErrValueTuple<number>> = doTry(fn);
    await expect(result).resolves.toEqual([
      new Error('Something went wrong'),
      undefined,
    ]);
  });

  it('returns a DoTryError if not a function passed as argument', () => {
    const [error]: ErrValueTuple<unknown> = doTry('not a function' as any);
    expect(error).toEqual(new DoTryError(ERR_NOT_A_FUNCTION, 'not a function'));
  });

  it('returns a DoTryError if null has been thrown', () => {
    const fn = () => {
      throw null;
    };
    const [error]: ErrValueTuple<unknown> = doTry(fn);
    expect(error).toEqual(new DoTryError(ERR_NULLISH_VALUE_THROWN, null));
  });

  it('returns a DoTryError if undefined has been thrown', () => {
    const fn = () => {
      throw undefined;
    };
    const [error]: ErrValueTuple<unknown> = doTry(fn);
    expect(error).toEqual(new DoTryError(ERR_NULLISH_VALUE_THROWN, undefined));
  });

  it('returns a DoTryError if promise has been rejected with null', () => {
    const fn = async () => {
      return new Promise<unknown>((_, reject) => {
        reject(null);
      });
    };
    const result = doTry(fn);
    return expect(result).resolves.toEqual([
      new DoTryError(ERR_NULLISH_VALUE_REJECTED, null),
      undefined,
    ]);
  });

  it('returns a DoTryError if promise has been rejected with undefined', () => {
    const fn = async () => {
      return new Promise<unknown>((_, reject) => {
        reject(undefined);
      });
    };
    const result = doTry(fn);
    return expect(result).resolves.toEqual([
      new DoTryError(ERR_NULLISH_VALUE_REJECTED, undefined),
      undefined,
    ]);
  });

  it('works for example', () => {
    expect.assertions(1);

    function div(a: number, b: number): number {
      if (b !== 0) return a / b;
      if (a !== 0) throw new Error(`Division by Zero`);
      throw new Error('Indeterminate Form');
    }

    const [errX, x] = doTry(() => div(4, 2));

    if (errX == null) {
      const doubleX = x * 2;
      expect(doubleX).toBe(4);
    }
  });

  it('does not require discriminating the error if function never returns', () => {
    const [error, value] = doTry(() => {
      throw new Error('Something went wrong');
    });

    const checkErr: Expect<Equal<typeof error, UnknownError>> = true;
    expect(checkErr).toBeTruthy();

    const checkValue: Expect<Equal<typeof value, never>> = true;
    expect(checkValue).toBeTruthy();
  });

  it('fails to call then if function returning promise throws', () => {
    const fn = (): Promise<number> => {
      throw new Error('Something went wrong');
    };

    expect(() =>
      doTry(fn).then(([error, value]) => [
        error && TypeError((error as any).message),
        value,
      ]),
    ).toThrowError();
  });

  it('is possible to call then if function returning promise throws using async', async () => {
    const fn = (): Promise<number> => {
      throw new Error('Something went wrong');
    };

    const [error] = await doTry(async () => fn()).then(
      ([error, value]) =>
        [error && TypeError((error as any).message), value] as const,
    );

    expect(error).toEqual(new TypeError('Something went wrong'));
  });
});
