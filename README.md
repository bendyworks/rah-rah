# RahRah

Use Javascript `await` while respecting failure cases without exceptions.

## Why does this exist?

If you want to use `await` and still get data from failure cases, you must use `try/catch`:

```javascript
async function myFunc() {
  try {
    let result = await someAsyncFunc();
    doSomething(result);
  } catch (e) {
    handleError(e);
  }
}
```

OK, I guess that doesn't look _terrible_, but how often are your functions that short? Just one or two more lines will start seriously separating the _origin_ of a problem from the _handling_ of the problem.

Instead, with RahRah, you can do this:

```javascript
import { R } from 'rah-rah';

async function myFunc() {
  let result = await R(someAsyncFunc());

  if (result.good) {
    doSomething(result.yay);
  } else {
    handleError(result.boo);
  }
}
```

Yes, the success value and failure value are named `yay` and `boo` respectively. Because short, meaningful names matter. :)

If you recognize this kind of thing from the Functional Programming world, it's basically Result/Either mapped inside a Promise... or something like that.

```javascript
import { R } from 'rah-rah';

async function myFunc() {
  let result = await R(someAsyncFunc());

  // NOTE: If this is confusing to you, don't worry!
  // This way of using rah-rah is totally optional:

  result.
    map(val => doSomething(yay)).
    mapBoo(val => handleError(val));
  // or
  someElement.innerHTML = result.withDefault('N/A');
}
```


## Installation

This library requires TypeScript, with at least `es2015` compatibility.

    $ npm install rah-rah --save


## License

License terms can be found in the LICENSE file.

## Author

RahRah was written by:

* [Brad Grzesiak](https://twitter.com/listrophy) - [Bendyworks](https://bendyworks.com)
