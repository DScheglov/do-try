# do-try-tuple [![Coverage Status](https://coveralls.io/repos/github/DScheglov/do-try-tuple/badge.svg?branch=main)](https://coveralls.io/github/DScheglov/do-try-tuple?branch=main) [![npm version](https://img.shields.io/npm/v/do-try-tuple.svg?style=flat-square)](https://www.npmjs.com/package/do-try-tuple) [![npm downloads](https://img.shields.io/npm/dm/do-try-tuple.svg?style=flat-square)](https://www.npmjs.com/package/do-try-tuple) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DScheglov/do-try-tuple/blob/master/LICENSE)

Catches errors and rejected promises, returns tuple with error and value.

- [Installation](#installation)
- [Usage](#usage)
- [Async Usage](#async-usage)
- [API](#api)
  - [`doTry` function](#dotry-function)
  - [`ErrValueTuple` type](#errvaluetuple-type)
  - [`UnknownError` type](#unknownerror-type)
  - [`DoTryError` class](#dotryerror-class)
  - [`DoTryErrorCode` type and constants](#dotryerrorcode-type-and-constants)
- [Important! Discriminating `ErrValueTuple`](#important-discriminating-errvaluetuple)
  - [Do not use `if (error)` or `if (!error)` to discriminate the tuple](#do-not-use-if-error-or-if-error-to-discriminate-the-tuple)
- [Using `doTry().then()`](#using-dotrythen)

## Installation

```bash
npm install do-try-tuple
```

## Usage

```typescript
import doTry from 'do-try-tuple';

function div(a: number, b: number): number {
  if (b !== 0) return a / b;
  if (a !== 0) throw new Error(`Division by Zero`);
  throw new Error('Indeterminate Form');
}

const [errX, x] = doTry(() => div(4, 2));

if (errX == null) {
  const doubleX = x * 2;
  console.log('doubleX:', doubleX);
}
```

## Async Usage

```typescript
import doTry from 'do-try-tuple';

const [error, users] = await doTry(() => fetchUsers());

if (error != null) {
  console.error('Failed to fetch users:', error);
} else {
  console.log('Users:', users);
}
```

## API

The library exports:

- `doTry` function (default export)
- `safe` promise wrapper to make it resolving to `ErrValueTuple`
- `Failure`, `Success` and `ErrValueTuple` types
- `UnknownError` type
- `success` and `failure` factory functions
- `DoTryError` class
- `DoTryErrorCode` type and constants

### `doTry` function

takes a function that may throw an error or return a promise that may be rejected.

```typescript
function doTry(fn: () => never): [UnknownError, never];
function doTry(fn: () => Promise<never>): Promise<[UnknownError, never]>;
function doTry<T>(fn: () => T): ErrValueTuple<T>;
function doTry<T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
```

### `safe` promise wrapper

is a function that wraps a promise and makes it resolving to `ErrValueTuple`:

```typescript
function safe<T>(promise: Promise<T>): Promise<ErrValueTuple<T>>;
```

It could be useful when you need to handle the promise rejection synchronously:

```typescript
import { safe } from 'do-try-tuple';

const [error, users] = await safe(fetchUsers());
```

### `Failure` type

is a tuple representing the error case:

```typescript
export type Failure = readonly [UnknownError, undefined];
```

### `Success` type

is a tuple representing the success case:

```typescript
export type Success<T> = readonly [undefined, T];
```

### `ErrValueTuple` type

is a union of `Failure` and `Success<T>`.

```typescript
export type ErrValueTuple<T> = Failure | Success<T>;
```

### `UnknownError` type

type represents an unknown, non-nullish value caught by `doTry` function.

```typescript
export type UnknownError = NonNullable<unknown>; // actually it is a {} type
```

In case when `doTry` catches `null` or `undefined` value, it returns a `DoTryError`
as the first item of the tuple.

The library respects the same motivation as caused introduction
[useUnknownInCatchVariables](https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables)
compiler option in TypeScript:

- we cannot be sure that all thrown errors are instances of `Error` class

### `success` and `failure` factory functions

These functions allow to create `ErrValueTuple` instances:

```typescript
export function success<T>(value: T): Success<T>;
export function failure(error: unknown): Failure;
```

The `failure` functions checks if `error` is not null or undefined, otherwise it throws
creates a `DoTryError` instance with `ERR_NULLISH_VALUE_CAUGHT` code and `error` as a cause.

It could be useful in tests:

```typescript
import { success, failure } from 'do-try-tuple';

test('div', () => {
  expect(doTry(() => div(4, 2))).toEqual(success(2));
  expect(doTry(() => div(4, 0))).toEqual(failure(new Error('Division by Zero')));
  expect(doTry(() => div(0, 0))).toEqual(failure(new Error('Indeterminate Form')));
});
```

### `DoTryError` class

is an error class that is returned when `doTry` cannot comply to the `ErrValueTuple` contract:

- when the `fn` argument is not a function
- when the caught error is `null` or `undefined`

```typescript
export class DoTryError extends Error {
  constructor(code: DoTryErrorCode, cause: unknown);
}
```

**Fields**:

| Field     | Type             | Description                                           |
| --------- | ---------------- | ----------------------------------------------------- |
| `message` | `string`         | error message                                         |
| `code`    | `DoTryErrorCode` | error code                                            |
| `cause`   | `unknown`        | caught error (`null` or `undefined`) or `fn` argument |

### `DoTryErrorCode` type and constants

is an union of string literal error codes that `DoTryError` class uses.

| Code / Instance Of                                                             | Description                                                           | Cause        |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------ |
| code: `'ERR_NOT_A_FUNCTION'`<br />class: `DoTryError.NotAFunction`             | `fn` argument is not a function                                       | `fn`         |
| code: `'ERR_NULLISH_VALUE_CAUGHT'`<br />class: `DoTryError.NullishValueCaught` | `doTry` caught `null` or `undefined` value                            | caught value |

## Important! Discriminating `ErrValueTuple`

To discriminate the `ErrValueTuple` type, you should compare the first element of the tuple to
`undefined`. The most concise way to do that is to use the `!= null` expression:

```typescript
const [err, value] = doTry(() => someFn(...someArgs));

if (err != null) {
  // handle error
  return;
}

// handle value
```

The most performant way is to use strict equality comparison:

```typescript
const [err, value] = doTry(() => someFn(...someArgs));

if (err !== undefined) {
  // handle error
  return;
}

// handle value
```

### Do not use `if (error)` or `if (!error)` to discriminate the tuple

The `if (error)` expression will not work as expected in `else` block, because `if` casts
`err` to `boolean` type and narrows its type in `then`-branch correctly, but in `else`-branch
the type of `err` is still `UnknownError | undefined`, so `TypeScript` cannot discriminate
the `ErrValueTuple` type correctly:

```typescript
const [error, value] = doTry(() => someFn(...someArgs));

if (error) {
  // handle error
  return;
}

// value is still of type `T | undefined`
// error is still of type `UnknownError | undefined`
```

## Using `doTry().then()`

You can map the result of `doTry` applied to function returning a promise using `then` method:

```typescript
import doTry from 'do-try-tuple';

const [error, users] = await doTry(() => fetchUsers()).then(
  ([err, users]) => [err && new SomeCustomError(err), users] as const,
);
```

However, consider that functions returning promises can throw error synchronously:

```typescript
const fetchUsers = (): Promise<string[]> => {
  if (Math.random() < 0.5) throw new Error('Failed to fetch users');
  return Promise.resolve(['Alice', 'Bob', 'Charlie']);
};
```

So, the `doTry` in this case returns an `ErrValueTuple` synchronously, and the
attempt to call `then` method on it will throw an error:
`TypeError: doTry(...).then is not a function`.

To handle this case, just add `async` keyword before `fn` argument:

```typescript
const [error, users] = await doTry(async () => fetchUsers()).then(
  ([err, users]) => [err && new SomeCustomError(err), users] as const,
);
```

So, use

```typescript
// CORRECT                       _____
const [err, value] = await doTry(async () => someFn(...))
  .then(([err, value]) => {
    // handle err and value
  });
```

instead of

```typescript
// WRONG                         ___________
const [err, value] = await doTry(/* async */() => someFn(...))
  .then(([err, value]) => {
    // handle err and value
  });
```

The same is relevant for any other method of `Promise` class, like `catch`, `finally`, etc.
