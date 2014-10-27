var Hysteresis = require('hysteresis')
var lo = require('./utils')



// Threshold Functions

exports.$cross = function $crossGreaterThan(config){
  var check = Hysteresis([(config.value - 2), config.value], { checkType: 'crosses', initialIsChange: false })
  return function $cross(x){ return Boolean(check(x)) }
}

exports.$crossOrEqual = function $crossGreaterThan(config){
  var check = Hysteresis([(config.value - 2), config.value], { initialIsChange: false })
  return function $cross(x){ return Boolean(check(x)) }
}

exports.$crossGreaterThan = function $crossGreaterThan(config){
  var check = Hysteresis([(config.value - 2), config.value], { checkType: 'crosses' })
  return function $crossGreaterThan(x){
    return check(x) === 2
  }
}

exports.$crossGreaterThanOrEqual = function $crossGreaterThanOrEqual(config){
  var check = Hysteresis([(config.value - 2), config.value])
  return function $crossGreaterThanOrEqual(x){
    return check(x) === 2
  }
}

exports.$crossLessThan = function $crossLessThan(config){
  var check = Hysteresis([config.value, (config.value + 2)], { checkType: 'crosses' })
  return function $crossLessThan(x){
    return check(x) === 1
  }
}

exports.$crossLessThanOrEqual = function $crossLessThanOrEqual(config){
  var check = Hysteresis([config.value, (config.value + 2)])
  return function $crossLessThanOrEqual(x){
    return check(x) === 1
  }
}



// Threshold Functions Aliases

exports.$c = exports.$cross
exports.$ce = exports.$crossOrEqual
exports.$cgt = exports.$crossGreaterThan
exports.$cgte = exports.$crossGreaterThanOrEqual
exports.$clt = exports.$crossLessThan
exports.$clte = exports.$crossLessThanOrEqual




// Comparison Functions

exports.$eq = function $EQ(config){
  return function $eq(x){
    return config.value === x
  }
}

exports.$neq = function $NE(config){
  return function $ne(x){
    return config.value !== x
  }
}

exports.$gt = function $GT(config){
  return function $gt(x){
    return config.value < x
  }
}

exports.$gte = function $GTE(config){
  return function $gte(x){
    return config.value <= x
  }
}

exports.$lt = function $LT(config){
  return function $lt(x){
    return config.value > x
  }
}

exports.$lte = function $LTE(config){
  return function $lte(x){
    return config.value >= x
  }
}



// Evaluation Functions

exports.$mod = function $MOD(config){
  var wantedRemainder = config.remainder || 0
  return function $mod(data){
    return (data % config.value) === wantedRemainder
  }
}



// Logical Functions

exports.$or = function $OR(config, core){
  var tests = config.map(core.createMatcher)
  return function $or(x){
    return lo.fnAny(tests, x)
  }
}

exports.$and = function $AND(config, core){
  // TODO assert config is array
  var tests = config.map(core.createMatcher)
  return function $and(data){
    return lo.fnAll(tests, data)
  }
}

exports.$nor = function $NOR(config, core){
  var tests = config.map(core.createMatcher)
  return function $nor(data){
    return lo.fnNor(tests, data)
  }
}

exports.$nand = function $NAND(config, core){
  var tests = config.map(core.createMatcher)
  return function $nand(data){
    for (var i = 0; i < tests.length; i++)
      if (!tests[i](data)) return true
    return false
  }
}

exports.$xor = function $NAND(config, core){
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
}

exports.$not = function $NOT(config, core){
  var test = core.createMatcher(config)
  return function $not(data){
    return !test(data)
  }
}

exports.$constant = function(config){
  return lo.constant(config.value)
}
