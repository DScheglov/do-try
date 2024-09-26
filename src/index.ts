import DoTryError, {
  DoTryErrorCode,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_CAUGHT,
} from './DoTryError.js';

export {
  DoTryError,
  DoTryErrorCode,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_CAUGHT,
};

const isPromise = (value: unknown): value is Promise<unknown> =>
  value != null && typeof (value as any).then === 'function';

export type UnknownError = NonNullable<unknown>;

export type Failure = readonly [UnknownError, undefined];
export type Success<T> = readonly [undefined, T];
export type ErrValueTuple<T> = Failure | Success<T>;

/** @since 1.1.0 */
export const success = <T>(value: T): Success<T> => [undefined, value] as const;

/** @since 1.1.0 */
export const failure = (err: unknown): Failure =>
  [err ?? new DoTryError.NullishValueCaught(err), undefined] as const;

export const safe: {
  (promise: Promise<never>): Promise<readonly [UnknownError, never]>;
  <T>(promise: Promise<T>): Promise<ErrValueTuple<T>>;
} = <T>(promise: Promise<T>): any => promise.then(success, failure);

export const doTry: {
  (fn: () => never): readonly [UnknownError, never];
  (fn: () => Promise<never>): Promise<readonly [UnknownError, never]>;
  <T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
  <T>(fn: () => T): ErrValueTuple<T>;
} = <T>(fn: () => T | Promise<T>): any => {
  if (typeof fn !== 'function') return failure(new DoTryError.NotAFunction(fn));

  try {
    const result = fn();
    return isPromise(result) ? safe(result) : success(result);
  } catch (error) {
    return failure(error);
  }
};

export default doTry;
