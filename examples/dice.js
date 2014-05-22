var dice = require("dice")

var Stats = require("../stats")
var s = Stats()

var rolls = []
for (var i = 0; i < 100; i++) {
  s.update(dice.sum(dice.roll("2d6")))
  console.log(s.getAll())
}

console.log(s)
