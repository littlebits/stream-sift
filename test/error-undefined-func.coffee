describe 'compilation error "undefined function"', ->

  it 'occurs if a function in the spec does not exist in the context', ->
    a.throws (-> ss a: b: $bar: 5),
    """
Error: The function "$bar" is not defined.

{
  "a": {
    "b": {
      "$bar": 5
        ^^^
    }
  }
}"""


  it 'correctly highlights position within a top-level compiling function', ->
    a.throws (-> ss $not: $bar: 5 ),
    """
Error: The function "$bar" is not defined.

{
  "$not": {
    "$bar": 5
      ^^^
  }
}"""

  it 'correctly highlights position within a sub-level compiling function', ->
    a.throws (-> ss a: $not: $bar: 5 ),
    """
Error: The function "$bar" is not defined.

{
  "a": {
    "$not": {
      "$bar": 5
        ^^^
    }
  }
}"""

  it 'correctly highlights position within a sub-level compiling function that accepts arrays', ->
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
