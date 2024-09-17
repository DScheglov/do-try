export const ERR_NOT_A_FUNCTION = 'ERR_NOT_A_FUNCTION';
export const ERR_NULLISH_VALUE_REJECTED = 'ERR_NULLISH_VALUE_REJECTED';
export const ERR_NULLISH_VALUE_THROWN = 'ERR_NULLISH_VALUE_THROWN';

export type DoTryErrorCode =
  | typeof ERR_NOT_A_FUNCTION
  | typeof ERR_NULLISH_VALUE_REJECTED
  | typeof ERR_NULLISH_VALUE_THROWN;

function doTryErrorMessage(code: DoTryErrorCode): string {
  switch (code) {
    case ERR_NOT_A_FUNCTION:
      return 'The "fn" argument is not a function';
    case ERR_NULLISH_VALUE_REJECTED:
      return 'Promise has been rejected with nullish value';
    case ERR_NULLISH_VALUE_THROWN:
      return 'Nullish value has been thrown';
  }
}

export default class DoTryError extends Error {
  static NotAFunction = class NotAFunction extends DoTryError {
    constructor(cause: null | undefined) {
      super(ERR_NOT_A_FUNCTION, cause);
    }
  }

  static NullishValueRejected = class NullishValueRejected extends DoTryError {
    constructor(cause: null | undefined) {
      super(ERR_NULLISH_VALUE_REJECTED, cause);
    }
  }

  static NullishValueThrown = class NullishValueThrown extends DoTryError {
    constructor(cause: null | undefined) {
      super(ERR_NULLISH_VALUE_THROWN, cause);
    }
  }

  constructor(
    public code: DoTryErrorCode,
    public cause: unknown,
  ) {
    super(doTryErrorMessage(code));
    Object.defineProperties(this, {
      code: { enumerable: true, writable: false, value: code },
      cause: { enumerable: true, writable: false, value: cause },
    });
  }
}
