compile = require('../lib/tokenize')



describe 'compile()', ->
  spec0 = { a: { b: $eq: 2 } }
  spec1 = { a: { b: $eq: 2 }, c: { $lt: 4 } }
  spec2 = { a: { b: { $gt:50, $lt:60 } } }
  spec3 = { a: { b: { $or: [{ $eq:2 }, { $eq:5 }] }, c: { $lt:4 } } }

  it '$or works top-level', ->
    spec = { $or: [{ a: { b: {$lt:4} }, c: {$gt:1} }] }
    expected =
      name: null
      conditions: [{
        name:'$or'
        config:[{a:{b:{$lt:4}}, c:{$gt:1}}]
      }]
      leafs: []
    actual = compile(spec)
    eq actual, expected


  it 'compile() converts user-spec into a machine-spec', ->
    spec3 = { a: { b: { $or: [{ $eq:2 }, { $eq:5 }] }, c: { $lt:4 } } }
    expected =
      name: null
      conditions: []
      leafs: [{
        name: 'a'
        conditions: []
        leafs: [{
          name: 'b'
          conditions: [{
            name:'$or'
            config: [{$eq:2},{$eq:5}]
          }]
          leafs: []
        },{
          name: 'c'
          conditions: [{ name:'$lt', config: {value:4}}]
          leafs: []
        }]
      }]
    actual = compile(spec3)
    # log(actual)
    eq actual, expected
