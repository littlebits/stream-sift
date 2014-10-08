M = require('../lib/index')



describe 'threshold functions', ->

  it '$risesAbove:x', ->
    test = M(a:$risesAbove:50)
    eq test(a:10), false
    eq test(a:50), false
    eq test(a:60), true
    eq test(a:48), false
    eq test(a:60), false
    eq test(a:47), false
    eq test(a:60), true

  it '$risesAboveOrEqual:x', ->
    test = M(a:$risesAboveOrEqual:50)
    eq test(a:10), false
    eq test(a:50), true
    eq test(a:60), false
    eq test(a:49), false
    eq test(a:60), false
    eq test(a:48), false
    eq test(a:60), true

  it '$fallsBelow:x', ->
    test = M(a:$fallsBelow:50)
    eq test(a:10), true

    eq test(a:50), false
    eq test(a:49), false

    eq test(a:52), false
    eq test(a:49), false

    eq test(a:53), false
    eq test(a:49), true

  it '$fallsBelowOrEqual:x', ->
    test = M(a:$fallsBelowOrEqual:50)
    eq test(a:10), true

    eq test(a:50), false
    eq test(a:49), false

    eq test(a:51), false
    eq test(a:49), false

    eq test(a:52), false
    eq test(a:49), true
