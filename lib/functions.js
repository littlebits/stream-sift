var debug = require('debug')('little-matcher:$fn')
var Hysteresis = require('hysteresis')
var lo = require('./utils')
var $FN = require('./function-factory')


exports.$risesAbove = $FN(function $RisesAbove(config){
  var check = Hysteresis([(config.value - 2), config.value], {checkType:'crosses'})
  return function $risesAbove(x){
    return check(x) === 2
  }
})

exports.$risesAboveOrEqual = $FN(function $RisesAboveOrEqual(config){
  var check = Hysteresis([(config.value - 2), config.value])
  return function $risesAboveOrEqual(x){
    return check(x) === 2
  }
})

exports.$fallsBelow = $FN(function $FallsBelow(config){
  var check = Hysteresis([config.value, (config.value + 2)], {checkType:'crosses'})
  return function $fallsBelow(x){
    return check(x) === 1
  }
})

exports.$fallsBelowOrEqual = $FN(function $FallsBelowOrEqual(config){
  var check = Hysteresis([config.value, (config.value + 2)])
  return function $fallsBelowOrEqual(x){
    return check(x) === 1
  }
})

exports.$eq = $FN(function $EQ(config){
  return function $eq(x){
    return config.value === x
  }
})

exports.$neq = $FN(function $NE(config){
  return function $ne(x){
    return config.value !== x
  }
})

exports.$gt = $FN(function $GT(config){
  return function $gt(x){
    return config.value < x
  }
})

exports.$gte = $FN(function $GTE(config){
  return function $gte(x){
    return config.value <= x
  }
})

exports.$lt = $FN(function $LT(config){
  return function $lt(x){
    return config.value > x
  }
})

exports.$lte = $FN(function $LTE(config){
  return function $lte(x){
    return config.value >= x
  }
})

exports.$mod = $FN(function $MOD(config){
  var wantedRemainder = config.remainder || 0
  return function $mod(data){
    return (data % config.value) === wantedRemainder
  }
})

exports.$or = $FN(function $OR(config, core){
  var tests = config.map(core.createMatcher)
  return function $or(x){
    return lo.fnAny(tests, x)
  }
})

exports.$and = $FN(function $AND(config, core){
  // TODO assert config is array
  var tests = config.map(core.createMatcher)
  return function $and(data){
    return lo.fnAll(tests, data)
  }
})

exports.$nor = $FN(function $NOR(config, core){
  var tests = config.map(core.createMatcher)
  return function $nor(data){
    return lo.fnNor(tests, data)
  }
})

exports.$nand = $FN(function $NAND(config, core){
  var tests = config.map(core.createMatcher)
  return function $nand(data){
    for (var i = 0; i < tests.length; i++)
      if (!tests[i](data)) return true
    return false
  }
})

exports.$xor = $FN(function $NAND(config, core){
  var tests = config.map(core.createMatcher)
  return function $nand(data){
    var first, second
    for (var i = 0; i < tests.length; i++) {
        second = tests[i](data)
        if (first === second) return false
        first = second
    }
    return true
  }
})

exports.$not = $FN(function $NOT(config, core){
  var test = core.createMatcher(config)
  return function $not(data){
    return !test(data)
  }
})
