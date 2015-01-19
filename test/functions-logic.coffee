
describe 'Logic Functions', ->

  it 'lone shallow $gt', ->
    test = ss a:$gt:30
    t test a:50
    f test a:30

  it 'deep $gt', ->
    test = ss a:b:c:$gt:30
    t test a:b:c:50
    f test a:b:c:30

  it 'AND deep/shallow $gt', ->
    test = ss a:{b:$gt:30}, z:$gt:30
    t test a:{b:31},z:31
    f test a:{b:31},z:29
    f test a:{b:29},z:31
    f test a:{b:29},z:29

  it '$and deep/shallow $gt', ->
    test = ss $and: [{a:b:$gt:30}, {z:$gt:30}]
    t test a:{b:31}, z:31
    f test a:{b:31},z:29
    f test a:{b:29},z:31
    f test a:{b:29},z:29

  it '$or w/ deep/shallow $gt', ->
    test = ss $or: [{a:b:$gt:30}, {z:$gt:30}]
    t test a:{b:31},z:31
    t test a:{b:31},z:29
    t test a:{b:29},z:31
    f test a:{b:29},z:29

  it '$or nested w/ deep/shallow $gt', ->
    test = ss a:b:$or:[{c:$gt:2},{d:$gt:2}]
    t test a:b:{c:3,d:0}
    t test a:b:{c:0,d:3}
    f test a:b:{c:0,d:0}

  it '$or nested w/ deep/shallow implicit $eq', ->
    test = ss a:b:$or:[{c:d:2},{z:y:2}]
    t test a:b:{c:{d:2},z:y:0}
    t test a:b:{c:{d:0},z:y:2}
    f test a:b:{c:{d:0},z:y:0}

  it '$or/$and mixed', ->
    test = ss a:b:$or:[{c:d:$and:[{e:1},{f:2}]},{$or:[{z:y:2},{w:$gt:2}]}]
    f test a:b:c:d:e:1
    t test a:b:c:d:{e:1,f:2}
    t test a:b:z:y:2
    t test a:b:w:3
    t test a:b:{c:{d:e:10},w:3}

  it '$nor deep/shallow $gt', ->
    test = ss $nor: [{a: b: $gt: 30}, {z: $gt: 30}]
    f test a:{b:31},z:31
    f test a:{b:31},z:29
    f test a:{b:29},z:31
    t test a:{b:29},z:29

  it '$nand deep/shallow $gt', ->
    test = ss $nand: [{a: b: $gt: 30}, {z: $gt: 30}]
    f test a:{b:31},z:31
    t test a:{b:31},z:29
    t test a:{b:29},z:31
    t test a:{b:29},z:29

  it '$xor deep/shallow $gt', ->
    test = ss $xor: [{a: b: $gt: 30}, {z: $gt: 30}]
    f test a:{b:31},z:31
    t test a:{b:31},z:29
    t test a:{b:29},z:31
    f test a:{b:29},z:29

  it '$not deep/shallow $gt', ->
    test = ss $not:a:b:$gt:30
    f test a:{b:31}
    f test a:{b:31}
    t test a:{b:29}
    t test a:{b:29}
