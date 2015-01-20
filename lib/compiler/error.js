var util = require('util')
var debug = require('debug')('stream-sift:error')
var u = require('../utils')
var symbols = require('./symbols')



var repeat = u.repeat,
    last = u.last,
    equal = u.equal,
    par = u.par,
    getType = u.getType

var fmt = util.format,
    inspect = util.inspect



/* Error-Throwing function
TODO this should be moved to another module probably. */

exports.fail = function fail(pattern, error) {
  debug('fail')

  /* Replace the basic error message with a full report of the problem.
  Especially interesting: this is where we tie the error to its context visually
  showing the user exactly where the mistake is within his spec. */
  error.message = report(pattern, error)

  /* TODO Not sure if this is a good idea, but the idea here is that
  we probably do not need the stack trace because this error is a parse
  issue that needs to be identified relative to the spec and nother else.
  This may turn out to be a terrible idea for xyz reasons. TBD. The rational
  is to provide a clearest possible message in logs. */
  // Error.prepareStackTrace = function() {}
  throw error
}



/* Types Of Errors */

var ERROR_CODES = {
  ENOF: 'ENOF'
}

exports.undefinedFunc = function errorUndefinedFunc(node) {
  return createError({
    code: ERROR_CODES.ENOF,
    message: fmt('The function %j is not defined.', node.value),
    location: tracePath(node)
  })
}





var isWildcard = par(equal, symbols.wildcard)
var isPlainObject = require('is-plain-object')
var isInvalidPatternType = function(x) {
  return !(isPlainObject(x) || isWildcard(x))
}

exports.assertPatternType = function assertPatternType(pattern) {
  if (isInvalidPatternType(pattern)) throw new Error(
    fmt('Error: Given argument type %s (%j) is incompatible with parameter type PlainObject.', getType(pattern), pattern)
  )

}



/* Private */


/* A custom function cosntructor. Unlike regular JavaScript functions
stream-sift errors have properties relating to spec location and error code. */

function createError(err) {
  var error = new Error(err.message)
  error.code = err.code || 'EUNKNOWN'
  error.location = err.location || ''
  return error
}


/* Produce a detailed report suitable for printing to the console. This report
is design for HUMAN consumption. TODO This report builder is currently
hard-coded to exclusively deal with undefinedFunction errors. For instance
the way we render underlines is bias to this case. */

function report(pattern, error) {
  debug('Prepare report')

  /* If this error does not have a code then it is not something we know how to
  report. */
  if (!error.code) return error.message

  var patternString = stringifySpec(pattern)
  var highlightCoordinates = calcHighlightCoordinates(error.location)
  patternString = spliceLine(patternString, highlightLine(highlightCoordinates))
  return 'Error: ' + error.message + '\n\n' + patternString
}



/* String Functions for Report Building */

var INDENT_SIZE = 2
var FUNC_SYMBOL = '$'
var keyRegExp = new RegExp('(^\\' + FUNC_SYMBOL + '+)?(.*)')



function highlightLine(highlightCoordinates) {
  return {
    lineNumber: highlightCoordinates.lineNumber,
    content: ''
    + repeat(highlightCoordinates.columnNumber, ' ')
    + repeat(highlightCoordinates.underlineSize, '^')
  }
}


function calcHighlightCoordinates(path) {
  var quoteSize = 1
  var keySize = calcKeySizing(last(path))

  return {
    columnNumber: (path.length * INDENT_SIZE) + quoteSize + keySize.prefix,
    /* Although achievable elsewhere (later) this +1 clearly emphasizes that
    this underline appears AFTER the target line. */
    lineNumber: path.length + 1,
    underlineSize: keySize.body
  }
}

function calcKeySizing(key) {
  var matches = key.match(keyRegExp)
  if (!matches) return { prefix: 0, body: 0 }

  return {
    prefix: (matches[1] && matches[1].length) || 0,
    body:   (matches[2] && matches[2].length) || 0
  }
}



function spliceLine(target, content) {
  var arr = target.split('\n')
  arr.splice(content.lineNumber, 0, content.content)
  return arr.join('\n')
}



function stringifySpec(o) {
  return JSON.stringify(o, null, INDENT_SIZE)
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
