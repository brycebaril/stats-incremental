'use strict'

const statslite = require('stats-lite')

module.exports = Stats

function Stats (smaBins) {
  if (!(this instanceof Stats)) return new Stats(smaBins)
  this.n = 0
  this.min = Number.MAX_VALUE
  this.max = -Number.MAX_VALUE
  this.sum = 0
  this.mean = 0
  if (smaBins == null || smaBins <= 0) {
    smaBins = 50
  }
  if (smaBins !== (smaBins | 0)) {
    throw new Error('SMA option must be an integer')
  }
  Object.defineProperty(this, 'smaBins', {
    enumerable: false,
    writable: false,
    value: smaBins
  })
  Object.defineProperty(this, '_bins', {
    enumerable: false,
    writable: false,
    value: []
  })
  Object.defineProperty(this, 'q', {
    enumerable: false,
    writable: true,
    value: 0
  })
  Object.defineProperty(this, 'variance', {
    enumerable: true,
    get: () => { return this.q / this.n }
  })
  Object.defineProperty(this, 'standard_deviation', {
    enumerable: true,
    get: () => { return Math.sqrt(this.q / this.n) }
  })
  Object.defineProperty(this, `sma${smaBins}`, {
    enumerable: true,
    get: () => { return statslite.mean(this._bins) }
  })
}

Stats.prototype.update = function update (value) {
  var num = parseFloat(value)
  if (isNaN(num)) {
    // Sorry, no NaNs
    return
  }
  this.n++
  this.min = Math.min(this.min, num)
  this.max = Math.max(this.max, num)
  this.sum += num
  var prevMean = this.mean
  this.mean = this.mean + (num - this.mean) / this.n
  this.q = this.q + (num - prevMean) * (num - this.mean)
  this._bins.push(value)
  if (this._bins.length > this.smaBins) {
    this._bins.shift()
  }
}

Stats.prototype.getAll = function getAll () {
  if (this.n === 0) {
    return null
  }
  var s = {
    n: this.n,
    min: this.min,
    max: this.max,
    sum: this.sum,
    mean: this.mean,
    variance: this.variance,
    standard_deviation: this.standard_deviation
  }
  s[`sma${this.smaBins}`] = this[`sma${this.smaBins}`]
  return s
}
