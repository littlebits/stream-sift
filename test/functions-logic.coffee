m = require('../lib/index')



describe 'littleMatch()', ->

  it 'lone shallow $gt', ->
    test = m(a:$gt:30)
    eq test(a:50), true
    eq test(a:30), false

  it 'deep $gt', ->
    test = m(a:b:c:$gt:30)
    eq test(a:b:c:50), true
    eq test(a:b:c:30), false

  it 'AND deep/shallow $gt', ->
    test = m(a:{b:$gt:30}, z:$gt:30)
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), false

  it 'Explicit AND deep/shallow $gt', ->
    test = m({$and: [{a:b:$gt:30}, {z:$gt:30}] })
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), false

  it 'OR w/ deep/shallow $gt', ->
    test = m($or: [{a:b:$gt:30}, {z:$gt:30}])
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), false

  it 'OR nested w/ deep/shallow $gt', ->
    test = m(a:b:$or:[{c:$gt:2},{d:$gt:2}])
    eq test(a:b:{c:3,d:0}), true
    eq test(a:b:{c:0,d:3}), true
    eq test(a:b:{c:0,d:0}), false

  it 'OR nested w/ deep/shallow implicit $eq', ->
    test = m(a:b:$or:[{c:d:2},{z:y:2}])
    eq test(a:b:{c:{d:2},z:y:0}), true
    eq test(a:b:{c:{d:0},z:y:2}), true
    eq test(a:b:{c:{d:0},z:y:0}), false

  it 'NOR deep/shallow $gt', ->
    test = m($nor: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), true

  it 'NAND deep/shallow $gt', ->
    test = m($nand: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), true

  it 'XOR deep/shallow $gt', ->
    test = m($xor: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), false

  it 'NOT deep/shallow $gt', ->
    test = m($not:a:b:$gt:30)
    eq test(a:{b:31}), false
    eq test(a:{b:31}), false
    eq test(a:{b:29}), true
    eq test(a:{b:29}), true
