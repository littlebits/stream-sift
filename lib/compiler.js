var u = require('./utils')
var parse = require('./parse')
var tokenize = require('./tokenize')
var failCompile = require('./fail-compile')



var compose = u.compose
var compile = compose(parse, tokenize)



module.exports = function(pattern) {
  try {
    return compile(pattern)
  } catch (err) {
    failCompile(pattern, err)
  }
}
