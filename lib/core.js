/* TODO Refactor all of Core; its somewhat nonsensical.
We need better names, fewer functions and more composition. */

var lo = require('./utils')
var createFunctionConstructor = require('./function-factory')
var tokenize = require('./tokenize')
var createParser = require('./parser')

var mutateMergeInto = lo.mutateMergeInto,
    hashMap = lo.hashMap,
    compose = lo.compose,
    fnAll = lo.fnAll



/* Core constructor creates a core instance with its own
internal state of pattern-matching functions. This allows for
e.g. multiple different pattern-matchers to co-exist at once,
helps testing, and is just generally tight encapsulation.

Core :: -> core */

module.exports = function Core() {

  /* Functions are stored as a lookup table. */
  var functions = {}
  var parse = createParser(functions)


  /* Expose principal sift constructor.
  This accepts a pattern and returns a function that will
  sift objects for pattern match. */
  function compile(pattern) {
    return compose(fnAll, parse, tokenize)(pattern)
  }

  compile.addFns = addFns
  compile.addFn = addFn

  return compile



  /* Add a hash of functions to this core's library. */
  function addFns(fs) {
    mutateMergeInto(functions, hashMap(createFunctionConstructor, fs))
    parse = createParser(functions)
    return compile
  }

  /* Add a single function to this core's library. */
  function addFn(name, fn) {
    functions[name] = createFunctionConstructor(fn)
    parse = createParser(functions)
    return compile
  }
}
