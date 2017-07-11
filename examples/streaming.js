var spigot = require('stream-spigot')
var through2 = require('through2')
var terminus = require('terminus')

var Stats = require('../stats')
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
