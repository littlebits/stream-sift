describe 'error of incorrect pattern type when', ->

  it 'is not an Object or Array', ->
    a.throws (-> ss 'foobar'), 'Error: Given argument type String ("foobar") is incompatible with parameter type PlainObject.'
