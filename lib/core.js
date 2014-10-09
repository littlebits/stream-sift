var debug = require('debug')('matcher-core')
var lo = require('./utils')
var compile = require('./compiler')
var $FN = require('./function-factory')
var merge = lo.merge



module.exports = Core

function Core(){
  var $fns = {}

  function core(pattern){
    return pipelineify(compile(pattern))
  }
  core.createMatcher = core

  core.addFn = addFn
  function addFn(name, fn){
    $fns[name] = $FN(fn)
    return core
  }

  core.addFns = addFns
  function addFns($newFns){
    for ($fname in $newFns) {
      if ($newFns.hasOwnProperty($fname)) {
        debug('Register new $fn: %s', $fname)
        $fns[$fname] = $FN($newFns[$fname])
      }
    }
    return core
  }

  core.pipelineify = pipelineify
  function pipelineify(compiledPattern){
    return pipeline(flatten([], [compiledPattern]))
  }

  core.flatten = flatten
  function flatten(path, pattern){
    debug('flatten: tree: %j < path', pattern, path)
    return lo.flatten(
      pattern
      .map(function(patpart){
        var partpath = (patpart.name ? path.concat([patpart.name]) : path)
        debug('flatten: leaf: %j', patpart)
        return patpart
          .conditions
          .map(function(cond){
            debug('flatten: +$fn: %j to path %j', cond, partpath)
            return $fns[cond.name](partpath, cond.config, core)
          })
          .concat(
            flatten(partpath, patpart.leafs)
          )
      }))
  }

  return core
}



// Helpers

function pipeline(tests){
  debug('create pipeline:', tests)
  return function doTest(data){
    return lo.fnAll(tests, data)
  }
}
