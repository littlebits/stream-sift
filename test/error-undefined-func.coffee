errors = require('../lib/errors')



describe 'error of undefined function correctly reports', ->

  it 'as a root-level func', ->
    a.throws (-> ss $nott: a: $gt: 5),
    """
Error: #{format(errors.ENOF.messageFormat, '$nott')}

{
  "$nott": {
    ^^^^
    "a": {
      "$gt": 5
    }
  }
}"""



  it 'within a path for kwargs-func', ->
    a.throws (-> ss a: b: $$bar: 5),
    """
Error: #{format(errors.ENOF.messageFormat, '$$bar')}

{
  "a": {
    "b": {
      "$$bar": 5
         ^^^
    }
  }
}"""



  it 'within a path for func', ->
    a.throws (-> ss a: b: $bar: 5),
    """
Error: #{format(errors.ENOF.messageFormat, '$bar')}

{
  "a": {
    "b": {
      "$bar": 5
        ^^^
    }
  }
}"""



  it 'within a root-level func', ->
    a.throws (-> ss $not: $bar: 5 ),
    """
Error: #{format(errors.ENOF.messageFormat, '$bar')}

{
  "$not": {
    "$bar": 5
      ^^^
  }
}"""



  it 'within a sub-level func', ->
    a.throws (-> ss a: $not: $bar: 5 ),
    """
Error: #{format(errors.ENOF.messageFormat, '$bar')}

{
  "a": {
    "$not": {
      "$bar": 5
        ^^^
    }
  }
}"""



  it 'within an array-accepting sub-level func', ->
    a.throws (-> ss a: $or: [{$bar: 5}, {$gte: 6}] ),
    """
Error: The function "$bar" is not defined.

{
  "a": {
    "$or": [
      {
        "$bar": 5
          ^^^
      },
      {
        "$gte": 6
      }
    ]
  }
}"""
