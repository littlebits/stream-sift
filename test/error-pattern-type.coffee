describe 'error of incorrect pattern type', ->

  it 'when arg is not a PlainObject', ->
    errorAs = (value)->
      """Error: Invalid pattern type. Pattern must either be a PlainObject or a match-all wildcard ("*"), but actual pattern given was #{value}."""

    a.throws (-> ss 'foobar'), errorAs('"foobar"')
    a.throws (-> ss /blah/), errorAs('{}')
    a.throws (-> ss 55), errorAs(55)
    a.throws (-> ss Object.create(null)), errorAs('{}')

  it 'except if arg is object', ->
    a.doesNotThrow (-> ss { foo: 'bar' })

  it 'except if arg is wilcard', ->
    a.doesNotThrow (-> ss '*')
