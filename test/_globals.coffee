{inspect, format} = require('util')
GLOBAL.format = format
GLOBAL.a = require('chai').assert
GLOBAL.ss = require('../lib')



# Expose Most-used Assertions

GLOBAL.t = a.isTrue
GLOBAL.f = a.isFalse
GLOBAL.eq = (a, b)->
  GLOBAL.a.deepEqual(a, b, "Not equal: \n\n#{inspect(a, {depth: 100})}\n\n #{inspect(b, {depth: 100})}\n\n")



# Expose Helpers

GLOBAL.log = (a)->
  console.log i(a, depth: 100)
