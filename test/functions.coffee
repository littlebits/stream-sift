
describe '$fns', ->

  describe '$mod', ->
    it '(by default) matches if data/value equals remainder of 0', ->
      test = ss a:$mod:5
      t test(a:5)

    it 'matches if the data/value equals given remainder', ->
      test = ss a:$mod:value:5, remainder:2
      f test(a:5)
      t test(a:12)



describe 'Special value "*"', ->

  it 'matches anything afterward', ->
    test = ss a:b:c:'*'
    t test a:b:c:'foo'

  it 'at root matches anything', ->
    test = ss '*'
    t test a:'foobar'
    t test 'foobar'
    t test a:b:c:'foobar'

  it 'honours AND semantics', ->
    test = ss a:'*', b:{c:'d'}
    f test b:c:'d'
    f test a:'foo'
    t test a:{b:'foo'}, b:c:'d'
