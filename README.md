# RahRah

Use Javascript `await` while respecting failure cases without exceptions.

## Why does this exist?

If you want to use `await` and still get data from failure cases, you must use `try/catch`:

```javascript
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

```
import { R } from 'rah-rah';

const result = await R(aPromise);
const otherResult = await R(ajaxAsPromise(url));
```

### Did it fail or succeed?

If you use `withDefault`, `map`, and `mapErr` (shown below), you shouldn't
need these.

```
import { R } from 'rah-rah';

const result = await R(aPromise);
if (result.good) {
  // ...
} else { ... }

// or

if (result.bad) {
  // ...
}
```

### Raw results

Use `result.ok` and `result.err`. If you use `withDefault`, `map`, and `mapErr`
(shown below), you shouldn't need these.

```
import { R } from 'rah-rah';

const result = await R(aPromise);
if (result.good) {
  doSomething(result.ok);
} else { ... }

// or

if (result.bad) {
  handleError(result.err);
}
```

### Collapsing errors

Perhaps you don't care about an error? Or you've correctly handled the error,
and you'd like to use either a successful value or a default value in the case
of a failure:

```
import { R } from 'rah-rah';

const result = await R(aPromise);
return result.withDefault('An error occurred.');
```

If you want the default to use the underlying error value, use `applyDefault`:


```
import { R } from 'rah-rah';

const result = await R(aPromise);
return result.applyDefault(err => `An error of type '${err.kind}' occurred.`);
```

### Changing ("map"ing) successful values

Need to change ("map") the successful value? Use `map`:

```
import { R } from 'rah-rah';

const result = await R(aPromise);

result.map(ok => ok.toUpperCase()); // still wrapped in a RahRah object!
```


### Changing ("map"ing) failure values

Need to change ("map") the failure value? Use `mapErr`:

```
import { R } from 'rah-rah';

const result = await R(aPromise);

result.mapErr(err => err.toLowerCase()); // still wrapped in a RahRah object!
```

### Collapsing errors & results

Perhaps you need to do something with both successful and failure situations,
and return an unwrapped value:

```
import { R } from 'rah-rah';

const result = await R(aPromise);

return result.flatten(ok => {
  return ok.toUpperCase();
}, err => {
  informExceptionHandler(err);
  return err.message.toLowerCase();
});
```

## Installation

This library requires TypeScript, with at least `es2015` compatibility.

    $ npm install rah-rah --save


## License

License terms can be found in the LICENSE file.

## Author

RahRah was written by:

* [Brad Grzesiak](https://twitter.com/listrophy) - [Bendyworks](https://bendyworks.com)
