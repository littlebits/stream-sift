describe 'error of incorrect pattern type', ->

  it 'when arg is not a PlainObject', ->
    a.throws (-> ss 'foobar'), 'Error: Given argument type String ("foobar") is incompatible with parameter type PlainObject.'
    a.throws (-> ss /blah/), 'Error: Given argument type Object ({}) is incompatible with parameter type PlainObject.'
    a.throws (-> ss 55), 'Error: Given argument type Number (55) is incompatible with parameter type PlainObject.'
    a.throws (-> ss Object.create(null)), 'Error: Given argument type Object ({}) is incompatible with parameter type PlainObject.'

  it 'except if arg is object', ->
    a.doesNotThrow (-> ss { foo: 'bar' })

  it 'except if arg is wilcard', ->
    a.doesNotThrow (-> ss '*')
