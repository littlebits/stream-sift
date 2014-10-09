m = require('../lib/index')



describe '$fns', ->

  it '$mod tests if the data divided by value equals a remainder of 0 by default', ->
    test = m({a:{$mod:5}})
    eq test({a:5}), true

  it '$mod tests if the data divided by value equals given remainder', ->
    test = m({a:{$mod:{value:5,remainder:2}}})
    eq test({a:5}), false
    eq test({a:12}), true
