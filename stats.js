"use strict";

module.exports = Stats

function Stats() {
  if (!(this instanceof Stats)) return new Stats()
  this.n = 0
  this.min = Number.MAX_VALUE
  this.max = -Number.MAX_VALUE
  this.sum = 0
  this.mean = 0
  Object.defineProperty(this, "q", {
    enumerable: false,
    writable: true,
    value: 0
  })
  Object.defineProperty(this, "variance", {
    enumerable: true,
    get: function () { return this.q / this.n }
  })
  Object.defineProperty(this, "standard_deviation", {
    enumerable: true,
    get: function () { return Math.sqrt(this.q / this.n)}
  })
}

Stats.prototype.update = function update(value) {
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
}

Stats.prototype.getAll = function getAll() {
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
  return s
}
