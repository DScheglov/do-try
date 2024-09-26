import { describe, expect, it } from '@jest/globals';
import DoTryError, {
  ERR_NOT_A_FUNCTION,
  ERR_NULLISH_VALUE_CAUGHT,
} from './DoTryError';

describe('DoTryError', () => {
  it('creates an instance with the correct error code and message', () => {
    const error = new DoTryError(ERR_NOT_A_FUNCTION, 'not a function');
    expect(error.code).toBe(ERR_NOT_A_FUNCTION);
    expect(error.cause).toBe('not a function');
    expect(error.message).toBe('The "fn" argument is not a function');
  });

  it('creates an instance with the correct error code, message, and cause', () => {
    const error = new DoTryError(ERR_NULLISH_VALUE_CAUGHT, undefined);
    expect(error.code).toBe(ERR_NULLISH_VALUE_CAUGHT);
    expect(error.message).toBe('The nullish value has been caught');
    expect(error.cause).toBe(undefined);
  });
});
