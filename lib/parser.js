var debug = require('debug')('stream-sift:compile')
var lo = require('./utils')
var tokenize = require('./tokenize')

var fnAll = lo.fnAll,
    flatten = lo.flatten,
    compose = lo.compose



module.exports = function createParser(library) {

  function parse(ast) {
    return parseLeaves([], [ast])
  }

  /* Create a compiler that will be passed to each function factory. This
  allows function factories to compile descendents in turn allowing
  the user to write patterns that use functions arbitrarially along a schema
  path.

  TODO This feels confusing and arbitrary. Consider rewriting this
  with an actual (and sane) architecture in mind. While the solution has worked
  so far its likely to make the future harder, e.g. good error handling etc.

  At least one problem with this is that we creating the compile function in
  multiple places, only possible because the final fnAll wrapper is so simple.
  But generally this also makes no sense. */
  var compile = compose(fnAll, parse, tokenize)

  return parse

  /* Private */

  function parseLeaves(path, leaves) {
    debug('Process tree: %j < path', leaves, path)
    return flatten(
      leaves
      .map(function(leaf) {
        var leafPath = (leaf.name ? path.concat([leaf.name]) : path)
        debug('Follow leaf: %j', leaf)
        return leaf.conditions.map(function(createFunctionConstructorRequest) {
          debug('Apply $function: %j to path %j', createFunctionConstructorRequest, leafPath)
          return library[createFunctionConstructorRequest.name](leafPath, createFunctionConstructorRequest.config, compile)
        })
        .concat(parseLeaves(leafPath, leaf.leafs))
      })
    )
  }
}
