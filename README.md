stats-incremental
=====

[![NPM](https://nodei.co/npm/stats-incremental.svg)](https://nodei.co/npm/stats-incremental/)

A light statstical package for incremental (i.e. rolling, streaming) sets of numbers.

E.g. given a source of numbers of unknown length that you would like to at any given time know any of:

  * count
  * min
  * max
  * sum
  * variance
  * standard_deviation
  * simple moving average

This module can be used either with Node `streams` via a wrapper such as `through2` or without being streaming.

Example
---

Non-streaming:

```javascript
var Stats = require("stats-incremental")

var dice = require("dice")
var s = Stats()

var rolls = []
for (var i = 0; i < 100; i++) {
  s.update(dice.sum(dice.roll("2d6")))
  console.log(s.getAll())
}

/* E.g.
  { n: 97,
  min: 2,
  max: 12,
  sum: 673,
  mean: 6.938144329896907,
  variance: 5.851843979168881,
  standard_deviation: 2.419058490233107,
  sma50: 6.82 }
*/


console.log(s.mean)
console.log(s.standard_deviation)

```

With streams:

```js
var spigot = require("stream-spigot")
var through2 = require("through2")
var terminus = require("terminus")

var Stats = require("stats-incremental")
var s = Stats()

var statStream = through2.obj(function (chunk, encoding, callback) {
  s.update(chunk)
  if (s.n % 100000 === 0) {
    console.log(s.getAll())
  }
  this.push(chunk)
  callback()
})

spigot.sync({objectMode: true}, Math.random)
  .pipe(statStream)
  .pipe(terminus.devnull({objectMode: true}))

/*
  { n: 100000,
    min: 2.0884908735752106e-7,
    max: 0.9999937505926937,
    sum: 49861.06196602131,
    mean: 0.49861061966021336,
    variance: 0.08331362954827709,
    standard_deviation: 0.28864100462040576,
    sma50: 0.5422519558777934 }
  { n: 200000,
    min: 2.0884908735752106e-7,
    max: 0.9999937505926937,
    sum: 99904.73041411326,
    mean: 0.49952365207056687,
    variance: 0.08316120223669865,
    standard_deviation: 0.2883768406732736,
    sma50: 0.4396136475716979 }
*/

```

API
===

## `const Stats = require("stats-incremental")`
## `var stats = new Stats(smaBins)`

Create a new incremental stats aggregator. The `smaBins` argument is optional (default 50) and will choose the size of recent window to retain to calculate the Simple Moving Average on the recent data.

## `stats.update(value)`

Update the aggregator with a value. Converted to a Number via parseFloat. If this results in NaN the update is skipped.

## `stats.getAll()`

Get a up-to-date clone of all of the stats stored.

E.g.

```js
{ n: 97,
  min: 2,
  max: 12,
  sum: 673,
  mean: 6.938144329896907,
  variance: 5.851843979168881,
  standard_deviation: 2.419058490233107,
  sma50: 6.82 }
```

## `stats.n`

The count of observations.

## `stats.min`

The min value observed.

## `stats.max`

The max value observed.

## `stats.sum`

The sum of all values observed.

## `stats.mean`

The arithmetic mean of the observations.

## `stats.variance`

The variance from the mean.

## `stats.standard_deviation`

The standard deviation of the values from the mean.

## `stats.smaXX`

Get the Simple Moving Average of the recent data. Default is to store 50 recent records and expose an `sma50` property with the simple moving average. If the `Stats` object is created with an argument of a number of SMA bins, the property will reflect the number of bins, e.g. `Stats(100)` will have an `sma100` instead of `sma50` property.

Alternatives
---

[stats-lite](http://npm.im/stats-lite) Operates on complete sets of numbers.

[stream-statistics](http://npm.im/stream-statistics) Is a similar module dedicated to streams.

LICENSE
=======

MIT
