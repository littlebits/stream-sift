/* TODO Refactor all of Core; its somewhat nonsensical.
We need better names, fewer functions and more composition. */

var debug = require('debug')('stream-sift:compile:ast')
var lo = require('./utils')
var compile = require('./compiler')
var createFunctionConstructor = require('./function-factory')

var fnAll = lo.fnAll,
    flatten = lo.flatten,
    par = lo.partial,
    mutateMergeInto = lo.mutateMergeInto,
    hashMap = lo.hashMap



/* Core constructor creates a core instance with its own
internal state of pattern-matching functions. This allows for
e.g. multiple different pattern-matchers to co-exist at once,
helps testing, and is just generally tight encapsulation.

Core :: -> core */

module.exports = function Core() {

  /* Functions are stored as a lookup table. */
  var functions = {}


  /* Expose principal sift constructor.
  This accepts a pattern and returns a function that will
  sift objects for pattern match. */
  function createSift(pattern) {
    return pipelineify(compile(pattern))
  }

  /* Expose partially applied API via props on
  main constructor. */
  createSift.createMatcher = createSift
  createSift.addFns = addFns
  createSift.addFn = addFn
  createSift.pipelineify = pipelineify
  createSift.flatten = compileAST

  return createSift



  /* Add a hash of functions to this core's library. */
  function addFns(fs) {
    mutateMergeInto(functions, hashMap(createFunctionConstructor, fs))
    return createSift
  }

  /* Add a single function to this core's library. */
  function addFn(name, fn) {
    functions[name] = createFunctionConstructor(fn)
    return createSift
  }

  /* Transform an AST into a an executable sift. */
  function pipelineify(ast) {
    var predicates = compileAST(ast)
    debug('create pipeline of predicates:', predicates)
    return par(fnAll, predicates)
  }

  function compileAST(ast) {
    return compileASTLeaves(functions, [], [ast])
  }

  function compileASTLeaves(library, path, leaves) {
    debug('Process tree: %j < path', leaves, path)
    return flatten(
      leaves
      .map(function(leaf) {
        var leafPath = (leaf.name ? path.concat([leaf.name]) : path)
        debug('Follow leaf: %j', leaf)
        return leaf.conditions.map(function(createFunctionConstructorRequest) {
          debug('Apply $function: %j to path %j', createFunctionConstructorRequest, leafPath)
          return library[createFunctionConstructorRequest.name](leafPath, createFunctionConstructorRequest.config, createSift)
        })
        .concat(compileASTLeaves(library, leafPath, leaf.leafs))
      })
    )
  }
}
