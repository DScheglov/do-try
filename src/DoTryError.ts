export const ERR_NOT_A_FUNCTION = 'ERR_NOT_A_FUNCTION';
export const ERR_NULLISH_VALUE_CAUGHT = 'ERR_NULLISH_VALUE_CAUGHT';

export type DoTryErrorCode =
  | typeof ERR_NOT_A_FUNCTION
  | typeof ERR_NULLISH_VALUE_CAUGHT;

function doTryErrorMessage(code: DoTryErrorCode): string {
  switch (code) {
    case ERR_NOT_A_FUNCTION:
      return 'The "fn" argument is not a function';
    case ERR_NULLISH_VALUE_CAUGHT:
      return 'The nullish value has been caught';
  }
}

export default class DoTryError extends Error {
  static NotAFunction = class NotAFunction extends DoTryError {
    constructor(cause: null | undefined) {
      super(ERR_NOT_A_FUNCTION, cause);
    }
  };

  static NullishValueCaught = class NullishValueCaught extends DoTryError {
    constructor(cause: null | undefined) {
      super(ERR_NULLISH_VALUE_CAUGHT, cause);
    }
  };

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
