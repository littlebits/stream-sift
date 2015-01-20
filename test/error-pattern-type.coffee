errors = require('../lib/compiler/errors')



describe 'error of incorrect pattern type', ->

  it 'when arg is not a PlainObject', ->
    errorAs = (value)-> 'Error: ' + format(errors.EPATTERNTYPE.messageFormat, value)

    a.throws (-> ss 'foobar'), errorAs("foobar")
    a.throws (-> ss /blah/), errorAs(/blah/)
    a.throws (-> ss 55), errorAs(55)
    a.throws (-> ss Object.create(null)), errorAs(Object.create(null))

  it 'except if arg is object', ->
    a.doesNotThrow (-> ss { foo: 'bar' })

  it 'except if arg is wilcard', ->
    a.doesNotThrow (-> ss '*')
