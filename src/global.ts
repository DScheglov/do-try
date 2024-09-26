import * as DoTryNs from './index.js';
import type {
  Failure as _Failure,
  Success as _Success,
  DoTryErrorCode as _DoTryErrorCode,
  UnknownError as _UnknownError,
  ErrValueTuple as _ErrValueTuple,
} from './index.js';

declare global {
  type DoTryErrorCode = _DoTryErrorCode;
  type UnknownError = _UnknownError;
  type Failure = _Failure;
  type Success<T> = _Success<T>;
  type ErrValueTuple<T> = _ErrValueTuple<T>;
  const doTry: typeof DoTryNs.default;
  const sage: typeof DoTryNs.safe;
  const DoTryError: typeof DoTryNs.DoTryError;
  const ERR_NOT_A_FUNCTION: typeof DoTryNs.ERR_NOT_A_FUNCTION;
  const ERR_NULLISH_VALUE_CAUGHT: typeof DoTryNs.ERR_NULLISH_VALUE_CAUGHT;
  const success: typeof DoTryNs.success;
  const failure: typeof DoTryNs.failure;
}

const theGlobal: any = typeof window !== 'undefined' ? window : global;

theGlobal.doTry = DoTryNs.default;
theGlobal.safe = DoTryNs.safe;
theGlobal.DoTryError = DoTryNs.DoTryError;
theGlobal.ERR_NOT_A_FUNCTION = DoTryNs.ERR_NOT_A_FUNCTION;
theGlobal.ERR_NULLISH_VALUE_CAUGHT = DoTryNs.ERR_NULLISH_VALUE_CAUGHT;
theGlobal.success = DoTryNs.success;
theGlobal.failure = DoTryNs.failure;
