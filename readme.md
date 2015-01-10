nhttp
-------

A simple zero config http server with livereload

### Requirements

[Node.js](http://nodejs.org)

### Installation

`npm install -g tinyhttp`

### Usage


```
# start server in current directory
nhttp
```

````
# start server in specified directory
nhttp -d somedir
```

```
# start server on specified port
nhttp -p someport
```

You can of course combine flags.

By default "live reloading" is enabled, for any extension
in sub directories, except for:

  + Hidden directories (begin with '.')

  + The following names: bower_components, node_modules, test.

An option will be added soon to extend/modify these patterns.

### Tests, etc...

  + Grab the dependencies

  `npm install`

  + Run the tests

  `npm test`

  + Generate coverage report

  `npm run cover`

  + Lint source code

  `npm run lint`


### Why?

This is a rewrite of the [sencisho](https://github.com/julien/sencisho) npm module,
the name didn't make much sense, I wanted to remove a few features and do some house cleaning.

The goal is to keep it as simple, clean and fast as possible.

### License

MIT


