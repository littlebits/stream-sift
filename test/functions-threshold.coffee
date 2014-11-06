
describe 'threshold functions', ->

  it '$cross', ->
    test = ss(a:$c:50)
    f test a:10 # initial is always false!
    t test a:60
    t test a:40
    f test a:50 # becuase *not* OrEqual semantic
    t test a:51
    f test a:48 # hysteresis size is 48-50
    t test a:47 # triggers because beyond hysteresis zone

  it '$crossOrEqual', ->
    test = ss a:$ce:50
    f test a:10 # initial is always false!
    t test a:60
    t test a:40
    t test a:50 # becuase *is* OrEqual semantic
    f test a:49 # hysteresis size is 48-50
    t test a:48 # at hysteresis zone and OrEqual semantic

  describe '$crossOrEqual edge-case', ->
    test = undefined
    beforeEach -> test = ss a:$ce:50

    it 'rise from below to equal then down again', ->
      eq [test(a:10), test(a:50), test(a:10)], [false, true, true]

    it 'rise from below to equal then up further', ->
      eq [test(a:10), test(a:50), test(a:90)], [false, true, false]

    it 'falling from above to equal then up again', ->
      eq [test(a:90), test(a:48), test(a:90)], [false, true, true]

    it 'falling from above to equal then down further', ->
      eq [test(a:90), test(a:48), test(a:10)], [false, true, false]

  it '$crossGreaterThan:x', ->
    test = ss a:$cgt:50
    f test a:10
    f test a:50
    t test a:60
    f test a:48
    f test a:60
    f test a:47
    t test a:60

  it '$crossGreaterThanOrEqual:x', ->
    test = ss a:$cgte:50
    f test a:10
    t test a:50
    f test a:60
    f test a:49
    f test a:60
    f test a:48
    t test a:60

  it '$crossLessThan:x', ->
    test = ss a:$clt:50
    t test a:10

    f test a:50
    f test a:49

    f test a:52
    f test a:49

    f test a:53
    t test a:49

  it '$crossLessThanOrEqual:x', ->
    test = ss a:$clte:50
    t test a:10

    f test a:50
    f test a:49

    f test a:51
    f test a:49

    f test a:52
    t test a:49
