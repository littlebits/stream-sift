compile = require('../lib/compiler')
# flatten = compile.flatten



describe 'little-matcher compiler', ->
  spec0 = { a: { b: $eq: 2 } }
  spec1 = { a: { b: $eq: 2 }, c: { $lt: 4 } }
  spec2 = { a: { b: { $gt:50, $lt:60 } } }
  spec3 = { a: { b: { $or: [{ $eq:2 }, { $eq:5 }] }, c: { $lt:4 } } }

  it 'compile() converts user-spec into a machine-spec', ->
    expected =
      isRoot: true
      leafs: [
        {
          name: 'a'
          conditions: []
          leafs: [
            {
              name: 'b'
              conditions: [{ name:'$or', config: [{$eq:2}, {$eq:5}]}]
              leafs: []
            },
            {
              name: 'c'
              conditions: [{ name:'$lt', config: {value:4}}]
              leafs: []
            }
          ]
        }
      ]
    actual = compile(spec3)
    # log(actual)
    eq actual, expected
