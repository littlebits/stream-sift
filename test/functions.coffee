m = require('../lib/index')



describe '$fns', ->

  describe '$mod', ->
    it 'matches if the data divided by value equals a remainder of 0 by default', ->
      test = m({a:{$mod:5}})
      eq test({a:5}), true

    it 'matches if the data divided by value equals given remainder', ->
      test = m({a:{$mod:{value:5,remainder:2}}})
      eq test({a:5}), false
      eq test({a:12}), true



describe 'Special value "*"', ->

  it 'matches anything afterward', ->
    test = m a:b:c:'*'
    eq test(a:b:c:'foo'), true

  it 'at root matches anything', ->
    test = m '*'
    eq test(a:'foobar'), true
    eq test('foobar'), true
    eq test(a:b:c:'foobar'), true

  it 'honours AND semantics', ->
    test = m a:'*', b:{c:'d'}
    eq test(b:c:'d'), false
    eq test(a:'foo'), false
    eq test(a:{b:'foo'}, b:c:'d'), true
