var Debug = require('debug')
var debug = Debug('stream-sift:core')
var df = Debug('stream-sift:core:flatten')
var lo = require('./utils')
var compile = require('./compiler')
var $FN = require('./function-factory')



module.exports = Core

function Core(){
  var $fns = {}

  core.createMatcher = core
  core.addFns = addFns
  core.addFn = addFn
  core.pipelineify = pipelineify
  core.flatten = flatten
  return core

  function core(pattern){
    return pipelineify(compile(pattern))
  }

  function addFns($newFns){
    for (var $fname in $newFns) {
      if ($newFns.hasOwnProperty($fname)) {
        debug('Register new $fn: %s', $fname)
        $fns[$fname] = $FN($newFns[$fname])
      }
    }
    return core
  }

  function addFn(name, fn){
    $fns[name] = $FN(fn)
    return core
  }

  function pipelineify(compiledPattern){
    return pipeline(flatten([], [compiledPattern]))
  }

  function flatten(path, pattern){
    df('Process tree: %j < path', pattern, path)
    return lo.flatten(
      pattern
      .map(function(patternPart){
        var patternPath = (patternPart.name ? path.concat([patternPart.name]) : path)
        df('Follow leaf: %j', patternPart)
        return patternPart.conditions.map(function($fnRequest){
          df('Apply $function: %j to path %j', $fnRequest, patternPath)
          return $fns[$fnRequest.name](patternPath, $fnRequest.config, core)
        })
        .concat(flatten(patternPath, patternPart.leafs))
      }))
  }
}



// Helpers

function pipeline(tests){
  debug('create pipeline:', tests)
  return function doTest(data){
    return lo.fnAll(tests, data)
  }
}
