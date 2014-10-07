i = require('util').inspect
GLOBAL.a = require('chai').assert

GLOBAL.log = (a)->
  console.log(i(a, {depth: 100}))

GLOBAL.eq = (a, b)->
  GLOBAL.a.deepEqual(a, b, "Not equal: \n\n#{i(a, {depth: 100})}\n\n #{i(b, {depth: 100})}\n\n")
