# was-tdd
> Checks a branch that claims to fix a bug using TDD principle

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![renovate-app badge][renovate-badge]][renovate-app]

## Use

Imagine someone claims that branch `fix-add` fixes a bug in branch `master` and was written in TDD style:

- first the developer wrote a failing test that shows the problem
- then the developer updated the code and the test is now passing

Is it true? Or is the developer just saying this?

Now you can easily check if the fix was really TDD.

```
npx was-tdd --branch fix-add --against master
```

## How it works

This little CLI utility does a few steps

- finds all files that changed in the branch `fix-add` against the branch `master`
- creates a new temp branch from `master`
- checks out changed **spec** files from branch `fix-add` (using regular expression)
- runs the tests using `npm test` command
  * the tests should FAIL
- checks out all files from `fix-add` branch
- runs the tests again
  * now the tests should PASS

If these steps complete - then the fix was written using TDD practice.

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2019

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/was-tdd/issues) on Github

## MIT License

Copyright (c) 2019 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/was-tdd.svg?downloads=true
[npm-url]: https://npmjs.org/package/was-tdd
[ci-image]: https://travis-ci.org/bahmutov/was-tdd.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/was-tdd
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

