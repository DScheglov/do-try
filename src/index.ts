import DoTryError, {
  DoTryErrorCode,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_REJECTED,
  ERR_NULLISH_VALUE_THROWN,
} from './DoTryError.js';

export {
  DoTryError,
  DoTryErrorCode,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_REJECTED,
  ERR_NULLISH_VALUE_THROWN,
};

const isPromise = (value: unknown): value is Promise<unknown> =>
  value != null && typeof (value as any).then === 'function';

export type UnknownError = NonNullable<unknown>;

export type ErrValueTuple<T> =
  | Readonly<[UnknownError, undefined]>
  | Readonly<[undefined, T]>;

/** @since 1.1.0 */
export const success = <T>(value: T) => [undefined, value] as const;

/** @since 1.1.0 */
export const failure = (err: UnknownError) => [err, undefined] as const;

export const doTry: {
  (fn: () => never): Readonly<[UnknownError, never]>;
  (fn: () => Promise<never>): Promise<Readonly<[UnknownError, never]>>;
  <T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
  <T>(fn: () => T): ErrValueTuple<T>;
} = <T>(fn: () => T | Promise<T>): any => {
  if (typeof fn !== 'function') return failure(new DoTryError.NotAFunction(fn));

  try {
    const result = fn();
    if (!isPromise(result)) return success(result);

    return result.then(
      success, //
      (error: unknown) =>
        failure(error ?? new DoTryError.NullishValueRejected(error)),
    );
  } catch (error) {
    return failure(error ?? new DoTryError.NullishValueThrown(error));
  }
};

export default doTry;
