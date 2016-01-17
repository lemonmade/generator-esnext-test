# generator-esnext-test

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> A Yeoman generator for creating tests using what's next in JavaScript.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-esnext-test using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-esnext-test
```

Then generate your new project:

```bash
yo esnext-test
```

## What You Get

The following is installed by this generator (`helper.js` is only installed when the `helper` option/ prompt is true, which it is by default):

```
|-- package.json
|-- test/
  |-- helper.js
```

The `package.json` file is created if it does not exist, and the `scripts` property is augmented with a `test` and `test:watch` command (and a `test:cover` command, if the `coverage` option/ prompt is set to `true`).

You can change the test directory by setting the `testDir` option/ prompt.

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © Chris Sauve

[npm-image]: https://badge.fury.io/js/generator-esnext-test.svg
[npm-url]: https://npmjs.org/package/generator-esnext-test

[travis-image]: https://travis-ci.org/lemonmade/generator-esnext-test.svg?branch=master
[travis-url]: https://travis-ci.org/lemonmade/generator-esnext-test

[daviddm-image]: https://david-dm.org/lemonmade/generator-esnext-test.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/lemonmade/generator-esnext-test
