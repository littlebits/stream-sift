var $FN = require('./function-factory')
var compile = require('./compiler')



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

exports.$or = $FN(function $OR(trees){
  // console.log('$or: init')
  var tests = trees.map(tester)
  return function $or(x){
    return fnAny(tests, x)
  }
})







var lo = require('lodash')



function tester(pattern){
  var tests = flatten([], [pattern])
  // console.log('tests:', tests)
  return function doTest(data){
    return fnAll(tests, data)
  }
}

function fnAll(fns, data){
  for (var i = 0; i < fns.length; i++)
    if (!fns[i](data)) return false
  return true
}

function fnAny(fns, data){
  for (var i = 0; i < fns.length; i++) {
    if (fns[i](data)) return true
  }
  return false
}

function flatten(path, pattern){
  // console.log('flatten: From path %j pattern: %j', path, pattern)
  return lo.flatten(pattern
    .map(function(patpart){
      var partpath = (patpart.name ? path.concat([patpart.name]) : path)
      // console.log('flatten: part: %j', patpart)
      return patpart
        .conditions
        .map(function(cond){
          // console.log('flatten: condition: %j', cond)
          return exports[cond.name](partpath, cond.config)
        })
        .concat(
          flatten(partpath, patpart.leafs)
        )
    }))
}
