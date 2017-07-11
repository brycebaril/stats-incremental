'use strict'
var test = require('tape')

var Stats = require('../stats')
var sl = require('stats-lite')

var input = [1, 23.9, -30, '33.2', 150, -150, 'cat']

test('simple', function (t) {
  t.goodEnuf = function (obs, expect, msg) {
    this.equals(obs.toPrecision(7), expect.toPrecision(7), msg)
  }

  var s = Stats()
  t.deepEqual(s.getAll(), null, 'nothing yet')
  t.equals(s.n, 0)

  s.update(1)
  t.equals(s.n, 1, 'count correct')
  t.equals(s.min, 1, 'min')
  t.equals(s.max, 1, 'max')
  t.equals(s.mean, 1, 'mean')
  t.equals(s.sum, 1, 'sum')
  t.equals(s.variance, 0, 'variance')
  t.equals(s.standard_deviation, 0, 'standard_deviation')
  t.equals(s.sma50, 1, 'sma50')

  s.update(23.9)
  t.equals(s.n, 2, 'count correct')
  t.equals(s.min, 1, 'min')
  t.equals(s.max, 23.9, 'max')
  t.equals(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.equals(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, 12.45, 'sma50')

  s.update(-30)
  t.equals(s.n, 3, 'count correct')
  t.equals(s.min, -30, 'min')
  t.equals(s.max, 23.9, 'max')
  t.goodEnuf(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.equals(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, -1.7000000000000004, 'sma50')

  s.update('33.2')
  t.equals(s.n, 4, 'count correct')
  t.equals(s.min, -30, 'min')
  t.equals(s.max, 33.2, 'max')
  t.equals(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.equals(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, 7.025, 'sma50')

  s.update(150)
  t.equals(s.n, 5, 'count correct')
  t.equals(s.min, -30, 'min')
  t.equals(s.max, 150, 'max')
  t.equals(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.equals(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, 35.62, 'sma50')

  s.update(-150)
  t.equals(s.n, 6, 'count correct')
  t.equals(s.min, -150, 'min')
  t.equals(s.max, 150, 'max')
  t.goodEnuf(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.goodEnuf(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, 4.683333333333333, 'sma50')

  s.update('cat')
  t.equals(s.n, 6, 'skipped NaN "cat"')
  t.equals(s.min, -150, 'min')
  t.equals(s.max, 150, 'max')
  t.goodEnuf(s.mean, sl.mean(input.slice(0, s.n)), 'mean')
  t.equals(s.sum, sl.sum(input.slice(0, s.n)), 'sum')
  t.goodEnuf(s.variance, sl.variance(input.slice(0, s.n)), 'variance')
  t.equals(s.standard_deviation, sl.stdev(input.slice(0, s.n)), 'standard_deviation')
  t.equals(s.sma50, 4.683333333333333, 'sma50')

  t.end()
})

test('zero', function (t) {
  var s = Stats()
  s.update(0)
  t.equals(s.n, 1)
  t.equals(s.min, 0)
  t.equals(s.max, 0)
  t.equals(s.sum, 0)
  t.end()
})

test('sma of different size', (t) => {
  t.goodEnuf = function (obs, expect, msg) {
    this.equals(obs.toPrecision(7), expect.toPrecision(7), msg)
  }

  var s = Stats(10)
  for (var i = 0; i < 100; i++) {
    s.update(i)
  }
  t.equals(s.n, 100, '100 entries')
  t.equals(s.min, 0, 'min')
  t.equals(s.max, 99, 'max')
  t.goodEnuf(s.mean, 49.5, 'mean')
  t.equals(s.sum, 4950, 'sum')
  t.goodEnuf(s.variance, 833.2500, 'variance')
  t.equals(s.standard_deviation, 28.86607004772212, 'standard_deviation')
  t.equals(s.sma10, 94.5, 'sma10')
  t.end()
})
