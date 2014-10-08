m = require('../lib/index')



describe 'littleMatch()', ->

  it 'lone shallow $gt', ->
    test = m({ a: { $gt: 30 } })
    eq test({a:50}), true
    eq test({a:30}), false

  it 'deep $gt', ->
    test = m({ a: { b: { c: { $gt: 30 } } } })
    eq test(a: b: c: 50), true
    eq test(a: b: c: 30), false

  it 'AND deep/shallow $gt', ->
    test = m(a: {b: $gt: 30}, z: $gt: 30)
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), false

  it 'OR deep/shallow $gt', ->
    test = m($or: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), false
