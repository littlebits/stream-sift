M = require('../lib/index')



describe 'threshold functions', ->

  it '$cross', ->
    test = M(a:$c:50)
    eq test(a:10), false # initial is always false!
    eq test(a:60), true
    eq test(a:40), true
    eq test(a:50), false # becuase *not* OrEqual semantic
    eq test(a:51), true
    eq test(a:48), false # hysteresis size is 48-50
    eq test(a:47), true # triggers because beyond hysteresis zone

  it '$crossOrEqual', ->
    test = M(a:$ce:50)
    eq test(a:10), false # initial is always false!
    eq test(a:60), true
    eq test(a:40), true
    eq test(a:50), true # becuase *is* OrEqual semantic
    eq test(a:49), false # hysteresis size is 48-50
    eq test(a:48), true # at hysteresis zone and OrEqual semantic

  describe '$crossOrEqual edge-case', ->
    test = undefined
    beforeEach -> test = M(a:$ce:50)

    it 'rise from below to equal then down again', ->
      eq [test(a:10), test(a:50), test(a:10)], [false, true, true]

    it 'rise from below to equal then up further', ->
      eq [test(a:10), test(a:50), test(a:90)], [false, true, false]

    it 'falling from above to equal then up again', ->
      eq [test(a:90), test(a:48), test(a:90)], [false, true, true]

    it 'falling from above to equal then down further', ->
      eq [test(a:90), test(a:48), test(a:10)], [false, true, false]

  it '$crossGreaterThan:x', ->
    test = M(a:$cgt:50)
    eq test(a:10), false
    eq test(a:50), false
    eq test(a:60), true
    eq test(a:48), false
    eq test(a:60), false
    eq test(a:47), false
    eq test(a:60), true

  it '$crossGreaterThanOrEqual:x', ->
    test = M(a:$cgte:50)
    eq test(a:10), false
    eq test(a:50), true
    eq test(a:60), false
    eq test(a:49), false
    eq test(a:60), false
    eq test(a:48), false
    eq test(a:60), true

  it '$crossLessThan:x', ->
    test = M(a:$clt:50)
    eq test(a:10), true

    eq test(a:50), false
    eq test(a:49), false

    eq test(a:52), false
    eq test(a:49), false

    eq test(a:53), false
    eq test(a:49), true

  it '$crossLessThanOrEqual:x', ->
    test = M(a:$clte:50)
    eq test(a:10), true

    eq test(a:50), false
    eq test(a:49), false

    eq test(a:51), false
    eq test(a:49), false

    eq test(a:52), false
    eq test(a:49), true
