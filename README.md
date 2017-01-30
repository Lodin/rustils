# rustils

[![Latest Stable Version](https://img.shields.io/npm/v/rustils.svg)](https://www.npmjs.com/package/rustils)
[![License](https://img.shields.io/npm/l/rustils.svg)](./LICENSE)
[![Build Status](https://img.shields.io/travis/Lodin/rustils/master.svg)](https://travis-ci.org/Lodin/rustils)

[![Test Coverage](https://img.shields.io/codecov/c/github/Lodin/rustils/master.svg)](https://codecov.io/gh/Lodin/rustils)

A port of some powerful Rust abstractions to JavaScript. By now it contains following modules:
* **[Option](https://lodin.github.io/rustils/modules/option.html)** ([rust doc](https://doc.rust-lang.org/std/option/index.html)) - an abstraction designed to
handle operations with `null` in the functional style, an implementation of functional monad 
`Maybe`.
* **[Result](https://lodin.github.io/rustils/modules/result.html)** ([rust doc](https://doc.rust-lang.org/std/result/)) - an abstraction that is able to 
supplement - or even replace, - the standard exception scheme. Depending on function result it
may wrap success or error value and is able to be processed in accordance with this result.

## Documentation
Complete project documentation can be found [here](https://lodin.github.io/rustils/).

## Installation
To install `rustils` run the following command in the console:
```bash
$ npm i --save rustils
```
## Usage
Import package in your code and you are ready:
```typescript
import {Some, Option} from 'rustils';

const option: Option<number> = Some(10);
assert.equal(option.andThen(v => v + 50).unwrap(), 60);
```
You can see detailed using in [API reference](https://lodin.github.io/rustils/).

### JavaScript usage
As you can see, all examples is written in Typescript here. But if you want to use this library
with JavaScript, there is no problem. Just throw out all the types and use the package.
```javascript
var rustils = require('rustils');
var Some = rustils.Some;
var None = rustils.None;

var option = Some(10);
assert.equal(option.andThen(function(v) { return v + 50 }).unwrap(), 60);
```

## About project
This project is highly inspired by [r-result](https://github.com/Havvy/result). `r-result` is a
nice project, but it lacks typescript support and implements only `Result` type, without `Option`.
So I decided to create my own rust-port project. Hope it will be useful for anyone. 

The `rustils` type system is made as close as it can to the Rust original. Some function like 
`take` or `as_ref` that has it's use in Rust, in JavaScript does not make sense, so they are not
implemented. 

## License
Information about license can be found [here](./LICENSE).