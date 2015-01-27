var u = require('./utils')
var compileAst = require('./compile-ast')
var parsePattern = require('./parse-pattern')
var failCompile = require('./fail-compile')



var compose = u.compose
var compilePattern = compose(compileAst, parsePattern)



module.exports = function(pattern) {
  try {
    return compilePattern(pattern)
  } catch (err) {
    failCompile(pattern, err)
  }
}
