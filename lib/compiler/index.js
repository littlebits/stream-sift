var u = require('../utils')
var parse = require('./parse')
var tokenize = require('./tokenize')
var error = require('./error')



var compose = u.compose
var compile = compose(parse, tokenize)



module.exports = function(pattern) {
  try {
    return compile(pattern)
  } catch (err) {
    error.fail(pattern, err)
  }
}
