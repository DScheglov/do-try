import * as DoTryNs from './index.js';
import type {
  DoTryErrorCode as _DoTryErrorCode,
  UnknownError as _UnknownError,
  ErrValueTuple as _ErrValueTuple,
} from './index.js';

declare global {
  type DoTryErrorCode = _DoTryErrorCode;
  type UnknownError = _UnknownError;
  type ErrValueTuple<T> = _ErrValueTuple<T>;
  const doTry: typeof DoTryNs.default;
  const DoTryError: typeof DoTryNs.DoTryError;
  const ERR_NOT_A_FUNCTION: typeof DoTryNs.ERR_NOT_A_FUNCTION;
  const ERR_NULLISH_VALUE_REJECTED: typeof DoTryNs.ERR_NULLISH_VALUE_REJECTED;
  const ERR_NULLISH_VALUE_THROWN: typeof DoTryNs.ERR_NULLISH_VALUE_THROWN;
  const success: typeof DoTryNs.success;
  const failure: typeof DoTryNs.failure;
}

const theGlobal: any = typeof window !== 'undefined' ? window : global;

theGlobal.doTry = DoTryNs.default;
theGlobal.DoTryError = DoTryNs.DoTryError;
theGlobal.ERR_NOT_A_FUNCTION = DoTryNs.ERR_NOT_A_FUNCTION;
theGlobal.ERR_NULLISH_VALUE_REJECTED = DoTryNs.ERR_NULLISH_VALUE_REJECTED;
theGlobal.ERR_NULLISH_VALUE_THROWN = DoTryNs.ERR_NULLISH_VALUE_THROWN;
theGlobal.success = DoTryNs.success;
theGlobal.failure = DoTryNs.failure;
