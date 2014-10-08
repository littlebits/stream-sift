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
  var tests = config.map(core.pipelineify)
  return function $or(x){
    return lo.fnAny(tests, x)
  }
})
