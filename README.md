# RahRah

Use Javascript `await` while respecting failure cases without exceptions.

## Why does this exist?

If you want to use `await` and still get data from failure cases, you must use `try/catch`:

```typescript
// old way

async function myFunc() {
  let result;
  try {
    result = await someAsyncFunc();
    doSomething(result);
  } catch (e) {
    handleError(e);
  }
}

// new way with rah-rah

import { R } from 'rah-rah';

async function myFunc() {
  const result = await R(someAsyncFunc());

  if (result.good) {
    doSomething(result.ok);
  } else {
    handleError(result.err);
  }
}

// or even

import { R } from 'rah-rah';

async function myFunc(): string {
  const result = await R(someAsyncFunc());

  return (
    result
      .map(doSomething)
      .mapErr(handleError)
      .withDefault('n/a')
  );
}
```

If you recognize this kind of thing from the Functional Programming world, it's basically Result/Either mapped inside a Promise... or something like that.

## Usage

### Creation

Insert a call to `R` between `await` and your promise:

```typescript
import { R } from 'rah-rah';

const result = await R(aPromise);
const otherResult = await R(ajaxAsPromise(url));
```

### Did it fail or succeed?

If you use `withDefault`, `map`, and `mapErr` (shown below), you shouldn't
need these.

```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<...>) {
  const result = await R(aPromise);
  if (result.good) {
    // ...
  } else { ... }

  // or

  if (result.bad) {
    // ...
  }
}
```

### Raw results

Use `result.ok` and `result.err`. If you use `withDefault`, `map`, and `mapErr`
(shown below), you shouldn't need these.

```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<...>) {
  const result = await R(aPromise);
  if (result.good) {
    doSomething(result.ok);
  } else { ... }

  // or

  if (result.bad) {
    handleError(result.err);
  }
}
```

### Collapsing errors

Perhaps you don't care about an error? Or you've correctly handled the error,
and you'd like to use either a successful value or a default value in the case
of a failure:

```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<string>): Promise<string> {
  const result = await R(aPromise);
  return result.withDefault('An error occurred.');
}
```

If you want the default to use the underlying error value, use `applyDefault`:


```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<string>): Promise<string> {
  const result = await R(aPromise);
  return result.applyDefault((err: Error) => `An error of type '${err.name}' occurred.`);
}
```

### Changing ("map"ing) successful values

Need to change ("map") the successful value? Use `map`:

```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<number>): Promise<RahRah<Error, string>> {
  const result = await R(aPromise);
  return result.map(ok => `answer: ${ok}`); // still wrapped in a RahRah object!
}
```


### Changing ("map"ing) failure values

Need to change ("map") the failure value? Use `mapErr`:

```typescript
import { R } from 'rah-rah';

async function go(aPromise: Promise<number>): Promise<RahRah<string, number>> {
  const result = await R(aPromise);
  return result.mapErr(err => err.message.toLowerCase()); // still wrapped in a RahRah object!
}
```

### Collapsing errors & results

Perhaps you need to do something with both successful and failure situations,
and return an unwrapped value:

```typescript
import { R } from 'rah-rah';

function double(result: RahRah<Error, number>): string {
  return result.flatten(ok => {
    return `doubled: ${ok * 2}`;
  }, err => {
    informExceptionHandler(err);
    return err.message.toLowerCase();
  });
}

const result = await R(aPromise);
console.log(double(result));
```

## Installation

This library requires TypeScript, with at least `es2015` compatibility.

    $ npm install typescript --save-dev
    $ npm install rah-rah --save


## Other similar libraries

### await-to-js

[await-to-js][to] provides a wonderfully simple API that does _nearly_ the
same thing:

```typescript
import to from 'await-to-js';

const [err, user] = await to(UserModel.findById(1));
```

The problem is that `await-to-js` assumes that you'll never want to use `null`
as a real error value; that is, you can never have a `null` value for `err`.
Similarly, you're disallowed from returning (as unlikely as it is) `undefined`
as your successful value.

These edge cases are nuanced and very unlikely, but they exist. RahRah avoids
these edge cases.

## License

License terms can be found in the LICENSE file.

## Author

RahRah was written by:

* [Brad Grzesiak](https://twitter.com/listrophy) - [Bendyworks](https://bendyworks.com)

[to]: https://github.com/scopsy/await-to-js
