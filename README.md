# do-try

Catches errors and rejected promises, returns tuple

## Installation

```bash
npm install do-try
```

## Usage

```typescript
import doTry from 'do-try';

function div(a: number, b: number): number {
  if (b !== 0) return a / b;
  if (a !== 0) throw new Error(`Division by Zero`);
  throw new Error('Indeterminate Form');
}

const [errX, x] = doTry(() => div(4, 2));

if (errX == null) {
  const doubleX = x * 2;
  expect(doubleX).toBe(4);
}
```

## Async Usage

```typescript
import doTry from 'do-try';

async function fetchUser(id: string): Promise<{ name: string } | null> {
  const [fetchError, response] = await doTry(() => fetch(`https://api.example.com/users/${id}`));

  if(fetchError != null) {
    // handle fetch error
    return null; // or throw fetchError;
  }

  if (!response.ok) {
    // handle response error
    return null; // or throw new Error(`HTTP Error: ${response.status}`);
  }

  const [jsonError, json] = await doTry(() => response.json());

  if(jsonError != null) {
    // handle json error
    return null; // or throw jsonError;
  }

  const [validationError, user] = doTry(() => {
    if (!isPlainObject(json)) {
      throw new Error('Invalid Response Format: expected plain object');
    }
    if (typeof json.name == null) {
      throw new Error('Invalid Response Format: missing name property');
    }
    if (typeof json.name !== 'string') {
      throw new Error('Invalid Response Format: name is not a string');
    }

    return json as { name: string };
  });

  if(validationError != null) {
    // handle validation error
    return null; // or throw validationError;
  }

  return user;
}

const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value !== 'object' || value == null || Array.isArray(value)
```

## API

The library exports:

- `doTry` function
- `ErrValueTuple` type
- `UnknownError` type

### `doTry` function

takes a function that may throw an error or return a promise that may be rejected.

```typescript
function doTry<T>(fn: () => T): ErrValueTuple<T>;
function doTry<T>(fn: () => Promise<T>): Promise<ErrValueTuple<T>>;
```

### `ErrValueTuple` type

is a union of two tuples: one representing the error case and the other
representing the success case.

```typescript
export type ErrValueTuple<T> =
  | [UnknownError, undefined] // error case
  | [undefined, T]; // success case
```

### `UnknownError` type

type represents an unknown, non-nullish value caught by `doTry` function.

```typescript
export type UnknownError = NonNullable<unknown>; // actually it is a {} type
```

In case when `doTry` catches `null` or `undefined` value, it returns a `ReferenceError`
as the first item of the tuple.
