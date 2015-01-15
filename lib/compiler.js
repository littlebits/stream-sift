var lo = require('./utils')
var createFunctionConstructor = require('./function-factory')
var tokenize = require('./tokenize')
var createParser = require('./parser')

var compose = lo.compose,
    fnAll = lo.fnAll,
    hashMap = lo.hashMap


module.exports = function createCompiler(settings) {

  var library = hashMap(createFunctionConstructor, settings.library)
  var parse = createParser(library)

  return compose(fnAll, parse, tokenize)
}
