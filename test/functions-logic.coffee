m = require('../lib/index')



describe 'Logic Functions', ->

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

  it '$and deep/shallow $gt', ->
    test = m({$and: [{a:b:$gt:30}, {z:$gt:30}] })
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), false

  it '$or w/ deep/shallow $gt', ->
    test = m($or: [{a:b:$gt:30}, {z:$gt:30}])
    eq test(a:{b:31},z:31), true
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), false

  it '$or nested w/ deep/shallow $gt', ->
    test = m(a:b:$or:[{c:$gt:2},{d:$gt:2}])
    eq test(a:b:{c:3,d:0}), true
    eq test(a:b:{c:0,d:3}), true
    eq test(a:b:{c:0,d:0}), false

  it '$or nested w/ deep/shallow implicit $eq', ->
    test = m(a:b:$or:[{c:d:2},{z:y:2}])
    eq test(a:b:{c:{d:2},z:y:0}), true
    eq test(a:b:{c:{d:0},z:y:2}), true
    eq test(a:b:{c:{d:0},z:y:0}), false

  it '$or/$and mixed', ->
    test = m(a:b:$or:[{c:d:$and:[{e:1},{f:2}]},{$or:[{z:y:2},{w:$gt:2}]}])
    eq test(a:b:c:d:e:1), false
    eq test(a:b:c:d:{e:1,f:2}), true
    eq test(a:b:z:y:2), true
    eq test(a:b:w:3), true
    eq test(a:b:{c:{d:e:10},w:3}), true

  it '$nor deep/shallow $gt', ->
    test = m($nor: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), false
    eq test(a:{b:29},z:31), false
    eq test(a:{b:29},z:29), true

  it '$nand deep/shallow $gt', ->
    test = m($nand: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), true

  it '$xor deep/shallow $gt', ->
    test = m($xor: [{a: b: $gt: 30}, {z: $gt: 30}])
    eq test(a:{b:31},z:31), false
    eq test(a:{b:31},z:29), true
    eq test(a:{b:29},z:31), true
    eq test(a:{b:29},z:29), false

  it '$not deep/shallow $gt', ->
    test = m($not:a:b:$gt:30)
    eq test(a:{b:31}), false
    eq test(a:{b:31}), false
    eq test(a:{b:29}), true
    eq test(a:{b:29}), true
