i = require('util').inspect
GLOBAL.a = require('chai').assert
GLOBAL.ss = require('../lib')



# Expose most-used assertions

GLOBAL.t = a.isTrue
GLOBAL.f = a.isFalse
GLOBAL.eq = (a, b)->
  GLOBAL.a.deepEqual(a, b, "Not equal: \n\n#{i(a, {depth: 100})}\n\n #{i(b, {depth: 100})}\n\n")



# Expose helpers

GLOBAL.log = (a)->
  console.log i(a, depth: 100)
