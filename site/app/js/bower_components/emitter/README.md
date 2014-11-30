# Emitter [![build status](https://secure.travis-ci.org/jhermsmeier/emitter.js.png)](http://travis-ci.org/jhermsmeier/emitter.js) [![NPM version](https://badge.fury.io/js/async-emitter.png)](https://npmjs.org/async-emitter)

A non-blocking event emitter. Non-blocking as in "if I call `emitter.emit()`,
the emission of events to their handlers won't block".

Given the nature of "events", one would think event emission is *always* asynchronous.
Looking at most implementations; that's not the case. This fixes it by running each
handler with setTimeout/nextTick.

## Install with [npm](https://npmjs.org/)
```shell
$ npm install async-emitter
```

## Install via [component](http://github.com/component/)
```shell
$ component install jhermsmeier/emitter.js
```

## Install with [bower](http://twitter.github.com/bower/)
```shell
$ bower install emitter
```


## API


### Class Properties

- *function* __Emitter.nextTick__

- *boolean* __Emitter.warn__


### Instance Methods

- {Emitter} __emitter.on__( *string* __event__, *function|object* __handler__ )

- {Emitter} __emitter.once__( *string* __event__, *function|object* __handler__ )

- {Boolean} __emitter.emit__( *string* __event__, [arg1], [arg2], [...] )

- {Boolean} __emitter.emitSync__( *string* __event__, [arg1], [arg2], [...] )

- {Emitter} __emitter.removeListener__( *string* __event__, *function|object* __handler__ )

- {Emitter} __emitter.removeAllListeners__( *string* [event] )

- {Emitter} __emitter.setMaxListeners__( *number* __value__ )

- {Array} __emitter.listeners__( *string* __event__ )


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jhermsmeier/emitter.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

