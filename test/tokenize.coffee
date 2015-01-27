compile = require('../lib/tokenize')



describe 'tokenize()', ->

  it 'empty pattern', ->
    eq compile({}), autoParent
      type: 'root'
      parent: null
      value: null
      children: []

  it 'target node and literal node', ->
    eq compile({ a: 4 }), autoParent
      type: 'root'
      parent: null
      value: null
      children: [
        {
          type: 'target'
          value: 'a'
          children: [
            {
              type: 'literal'
              value: 4
              children: []
            }
          ]
        }
      ]

  # TODO Many more cases... We use the principals of fuzzy-testing...



# This utility loops through children and assigns their parent property.
# It is very hard to do this manually not least because it requires that
# values are created separately and then gluded-by-reference together.
# At the same time, writing tests in there currents state requires that
# we manually type out ASTs. so this function aims to make this task easier
# without obscures our tests at ~all.
autoParent = (x)->
  x.children.map (y)->
    y.parent = x
    autoParent y
  x
