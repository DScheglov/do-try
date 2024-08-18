import DoTryError, {
  DoTryErrorCode,
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_REJECTED,
  ERR_NULLISH_VALUE_THROWN,
} from './DoTryError';

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

const success = <T>(value: T): Readonly<[undefined, T]> => [undefined, value];

const failure = (
  err: unknown,
  code: DoTryErrorCode,
): Readonly<[UnknownError, undefined]> => [
  err ?? new DoTryError(code, err),
  undefined,
];

const doTry: {
  (fn: () => never): Readonly<[UnknownError, never]>;
  (fn: () => Promise<never>): Promise<Readonly<[UnknownError, never]>>;
  <T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
  <T>(fn: () => T): ErrValueTuple<T>;
} = <T>(fn: () => T | Promise<T>): any => {
  if (typeof fn !== 'function')
    return failure(new DoTryError(ERR_NOT_A_FUNCTION, fn), ERR_NOT_A_FUNCTION);

  try {
    const result = fn();
    if (!isPromise(result)) return success(result);

    return result.then(
      success, //
      (error: unknown) => failure(error, ERR_NULLISH_VALUE_REJECTED),
    );
  } catch (error) {
    return failure(error, ERR_NULLISH_VALUE_THROWN);
  }
};

export default doTry;
