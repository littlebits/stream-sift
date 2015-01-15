var Hysteresis = require('hysteresis')
var lo = require('./utils')



// Threshold Functions

exports.$cross = function $CROSS_FACTORY(config) {
  var hopts = { checkType: 'crosses', initialIsChange: false }
  var check = Hysteresis([(config.value - 2), config.value], hopts)
  return function $cross(x) {
    return Boolean(check(x))
  }
}

exports.$crossOrEqual = function $CROSS_OR_EQUAL_FACTORY(config) {
  var hopts = { initialIsChange: false }
  var check = Hysteresis([(config.value - 2), config.value], hopts)
  return function $cross(x) {
    return Boolean(check(x))
  }
}

exports.$crossGreaterThan = function $CROSS_GREATER_THAN_FACTORY(config) {
  var hopts = { checkType: 'crosses' }
  var check = Hysteresis([(config.value - 2), config.value], hopts)
  return function $crossGreaterThan(x) {
    return check(x) === 2
  }
}

exports.$crossGreaterThanOrEqual = function $CROSS_GREATER_THAN_OR_EQUAL_FACTORY(config) {
  var check = Hysteresis([(config.value - 2), config.value])
  return function $crossGreaterThanOrEqual(x) {
    return check(x) === 2
  }
}

exports.$crossLessThan = function $CROSS_LESS_THAN_FACTORY(config) {
  var hopts = { checkType: 'crosses' }
  var check = Hysteresis([config.value, (config.value + 2)], hopts)
  return function $crossLessThan(x) {
    return check(x) === 1
  }
}

exports.$crossLessThanOrEqual = function $CROSS_LESS_THAN_OR_EQUAL_FACTORY(config) {
  var check = Hysteresis([config.value, (config.value + 2)])
  return function $crossLessThanOrEqual(x) {
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

exports.$eq = function $EQ_FACTORY(config) {
  return function $eq(x) {
    return config.value === x
  }
}

exports.$neq = function $NE_FACTORY(config) {
  return function $ne(x) {
    return config.value !== x
  }
}

exports.$gt = function $GT_FACTORY(config) {
  return function $gt(x) {
    return config.value < x
  }
}

exports.$gte = function $GTE_FACTORY(config) {
  return function $gte(x) {
    return config.value <= x
  }
}

exports.$lt = function $LT_FACTORY(config) {
  return function $lt(x) {
    return config.value > x
  }
}

exports.$lte = function $LTE_FACTORY(config) {
  return function $lte(x) {
    return config.value >= x
  }
}



// Evaluation Functions

exports.$mod = function $MOD_FACTORY(config) {
  var wantedRemainder = config.remainder || 0
  return function $mod(data) {
    return (data % config.value) === wantedRemainder
  }
}



// Logical Functions

/* Logical functions use "compile" in order to achieve new semantics around
resolving children. By default children must all resolve to `true` for the
parent to be `true`(a recursive fact). However to express other logic such
as OR this behaviour must be altered.

The solution is that "compile" liberates a function factory to compile its own
children and then *decide how to resolve net truthiness*. For example in the
case of OR the requirement for the parent to be true is that AT LEAST one
child is true and therefore it will reach for an `fnAny` whereas the default
would have  been `fnAll`. */

exports.$or = function $OR_FACTORY(config, compile) {
  var tests = config.map(compile)
  return function $or(x) {
    return lo.fnAny(tests, x)
  }
}

exports.$and = function $AND_FACTORY(config, compile) {
  var tests = config.map(compile)
  return function $and(data) {
    return lo.fnAll(tests, data)
  }
}

exports.$nor = function $NOR_FACTORY(config, compile) {
  var tests = config.map(compile)
  return function $nor(data) {
    return lo.fnNor(tests, data)
  }
}

exports.$nand = function $NAND_FACTORY(config, compile) {
  var tests = config.map(compile)
  return function $nand(data) {
    for (var i = 0; i < tests.length; i++)
      if (!tests[i](data)) return true
    return false
  }
}

exports.$xor = function $XOR_FACTORY(config, compile) {
  var tests = config.map(compile)
  return function $xor(data) {
    var first, second
    for (var i = 0; i < tests.length; i++) {
        second = tests[i](data)
        if (first === second) return false
        first = second
    }
    return true
  }
}

exports.$not = function $NOT_FACTORY(config, compile) {
  var test = compile(config)
  return function $not(data) {
    return !test(data)
  }
}



// Miscellaneous Functions

exports.$constant = function $CONSTANT_FACTORY(config) {
  return lo.constant(config.value)
}
