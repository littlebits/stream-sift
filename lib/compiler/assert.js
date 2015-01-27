var util = require('util')
var isPlainObject = require('is-plain-object')
var symbols = require('./symbols')
var errors = require('./errors')



var fmt = util.format



exports.funcDefined = function assertFuncDefined(func, node) {
  if (!func) throw createErrorUndefinedFunc(node)
}

exports.patternType = function assertPatternType(pattern) {
  if (!(isPlainObject(pattern) || pattern === symbols.wildcard))
    throw createErrorPatternType(pattern)
}



/* Private */

/* Error Constructors */

function createErrorPatternType(pattern) {
  return createError({
    code: errors.EPATTERNTYPE.code,
    message: 'Error: ' + fmt(errors.EPATTERNTYPE.messageFormat, pattern)
  })
}

function createErrorUndefinedFunc(node) {
  return createError({
    code: errors.ENOF.code,
    message: fmt(errors.ENOF.messageFormat, node.value),
    location: tracePath(node)
  })
}



/* A custom function cosntructor. Unlike regular JavaScript functions
stream-sift errors have properties relating to spec location and error code. */

function createError(err) {
  var error = new Error(err.message)
  error.code = err.code || 'EUNKNOWN'
  error.location = err.location || ''
  return error
}



/* From any node create the path to it from the root node. */

function tracePath(node) {
  var path = [node.value]
  var node_ = node
  while (node_.parent && node_.parent.type !== 'root') {
    path.unshift(node_.parent.value)
    node_ = node_.parent
  }
  return path
}
