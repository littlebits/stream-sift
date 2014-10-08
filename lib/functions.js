var lo = require('./utils')
var $FN = require('./function-factory')
var debug = require('debug')('little-matcher:$fn')



exports.$gt = $FN(function $GT(config){
  return function $gt(x){
    return config.value < x
  }
})

exports.$lt = $FN(function $LT(config){
  return function $lt(x){
    return config.value > x
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
