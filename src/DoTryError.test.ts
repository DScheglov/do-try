import { describe, expect, it } from '@jest/globals';
import DoTryError, {
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_REJECTED,
  ERR_NULLISH_VALUE_THROWN,
} from './DoTryError';

describe('DoTryError', () => {
  it('creates an instance with the correct error code and message', () => {
    const error = new DoTryError(ERR_NOT_A_FUNCTION, 'not a function');
    expect(error.code).toBe(ERR_NOT_A_FUNCTION);
    expect(error.cause).toBe('not a function');
    expect(error.message).toBe('The "fn" argument is not a function');
  });

  it('creates an instance with the correct error code, message, and cause', () => {
    const error = new DoTryError(ERR_NULLISH_VALUE_REJECTED, null);
    expect(error.code).toBe(ERR_NULLISH_VALUE_REJECTED);
    expect(error.message).toBe('Promise has been rejected with nullish value');
    expect(error.cause).toBe(null);
  });

  it('creates an instance with the correct error code, message, and cause', () => {
    const error = new DoTryError(ERR_NULLISH_VALUE_THROWN, undefined);
    expect(error.code).toBe(ERR_NULLISH_VALUE_THROWN);
    expect(error.message).toBe('Nullish value has been thrown');
    expect(error.cause).toBe(undefined);
  });
});
