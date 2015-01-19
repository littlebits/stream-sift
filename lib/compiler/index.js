var u = require('../utils')
var parse = require('./parse')
var tokenize = require('./tokenize')



var compose = u.compose



module.exports = compose(parse, tokenize)
