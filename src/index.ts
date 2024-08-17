const isPromise = (value: unknown): value is Promise<unknown> =>
  value != null && typeof (value as any).then === 'function';

export type UnknownError = NonNullable<unknown>;

export type ErrValueTuple<T> =
  | [UnknownError, undefined] //
  | [undefined, T];

const doTry: {
  (fn: () => never): ErrValueTuple<never>;
  (fn: () => Promise<never>): Promise<ErrValueTuple<never>>;
  <T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
  <T>(fn: () => T): ErrValueTuple<T>;
} = <T>(fn: () => T | Promise<T>): any => {
  try {
    const result = fn();
    if (isPromise(result))
      return result.then(
        (value) => [undefined, value],
        (error: unknown) => [
          error ??
            new ReferenceError(`Promise has been rejected with ${error}`),
          undefined,
        ],
      );
    return [undefined, result];
  } catch (err) {
    return [
      err ?? new ReferenceError(`${err} has been thrown`), //
      undefined,
    ];
  }
};

export default doTry;
