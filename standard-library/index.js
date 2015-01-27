var debug = require('debug')('stream-sift:func')
var u = require('../lib/utils')
var Hysteresis = require('hysteresis')



var compose = u.compose,
    not = u.not,
    negate = u.negate,
    or = u.or,
    and = u.and,
    equal = u.equal



module.exports = {
  $greaterThan:         constant(function(a, b) { return a < b }),
  $greaterThanOrEqual:  constant(function(a, b) { return a <= b }),
  $lessThan:            constant(function(a, b) { return a > b }),
  $lessThanOrEqual:     constant(function(a, b) { return a >= b }),
  $equal:               constant(equal),
  $notEqual:            constant(negate(equal)),
  $notOr:               constant(negate(or)),
  $notAnd:              constant(negate(and)),
  $xor:                 constant(function(a, b) { return (a && !b) || (!a && b) }),
  $not:                 constant(not),
  $or:                  constant(or),
  $and:                 constant(and),
  $cross: function(config) {
    var hopts = { checkType: 'crosses', initialIsChange: false }
    var check = Hysteresis([(config.value - 2), config.value], hopts)
    return compose(Boolean, check)
  },
  $crossOrEqual: function(config) {
    var hopts = { initialIsChange: false }
    var check = Hysteresis([(config.value - 2), config.value], hopts)
    return compose(Boolean, check)
  },
  $crossGreaterThan: function(config) {
    var hopts = { checkType: 'crosses' }
    var check = Hysteresis([(config.value - 2), config.value], hopts)
    return function(x) {
      return check(x) === 2
    }
  },
  $crossGreaterThanOrEqual: function(config) {
    var check = Hysteresis([(config.value - 2), config.value])
    return function(x) {
      return check(x) === 2
    }
  },
  $crossLessThan: function(config) {
    var hopts = { checkType: 'crosses' }
    var check = Hysteresis([config.value, (config.value + 2)], hopts)
    return function(x) {
      return check(x) === 1
    }
  },
  $crossLessThanOrEqual: function(config) {
    var check = Hysteresis([config.value, (config.value + 2)])
    return function(x) {
      return check(x) === 1
    }
  },
  $mod: function(config) {
    var wantedRemainder = config.remainder || 0
    return function $mod(data) {
      return (data % config.value) === wantedRemainder
    }
  }
}



function constant(f) {
  return function(config) {
    if (config === 'COMPUTED_ARGS') return f

    debug('configuring function %j with %j', f.name, config.value)
    return f.bind(null, config.value)
  }
}



/* Add short-hand aliases. */

var alias = u.par(u.alias, module.exports)

alias('$cross', '$c')
alias('$crossOrEqual', '$ce')
alias('$crossGreaterThan', '$cgt')
alias('$crossGreaterThanOrEqual', '$cgte')
alias('$crossLessThan', '$clt')
alias('$crossLessThanOrEqual', '$clte')

alias('$equal', '$eq')
alias('$notEqual', '$neq')
alias('$greaterThan', '$gt')
alias('$greaterThanOrEqual', '$gte')
alias('$lessThanOrEqual', '$lte')
alias('$lessThan', '$lt')
alias('$notAnd', '$nand')
alias('$notOr', '$nor')
alias('$not', '$n')
