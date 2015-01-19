var debug = require('debug')('stream-sift:error')
var u = require('../utils')
var util = require('util')



var repeat = u.repeat
var fmt = util.format,
    inspect = util.inspect



/* Error-Throwing function
TODO this should be moved to another module probably. */

exports.fail = function fail(spec, error) {
  debug('fail')

  /* Replace the basic error message with a full report of the problem.
  Especially interesting: this is where we tie the error to its context visually
  showing the user exactly where the mistake is within his spec. */
  error.message = report(spec, error)

  /* TODO Not sure if this is a good idea, but the idea here is that
  we probably do not need the stack trace because this error is a parse
  issue that needs to be identified relative to the spec and nother else.
  This may turn out to be a terrible idea for xyz reasons. TBD. The rational
  is to provide a clearest possible message in logs. */
  Error.prepareStackTrace = function() {}
  throw error
}



/* Types Of Errors */

exports.undefinedFunc = function errorUndefinedFunc(node) {
  return createError({
    code: 'ENOF',
    message: fmt('The function %j is not defined.', node.value),
    location: tracePath(node)
  })
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

function report(spec, error) {
  debug('Prepare report')
  var specString = stringifySpec(spec)
  var highlightCoordinates = calcHighlightCoordinates(error.location)
  specString = spliceLine(specString, highlightLine(highlightCoordinates))
  return 'Error: ' + error.message + '\n\n' + specString
}



/* String Functions for Report Building */

var INDENT_SIZE = 2


function highlightLine(highlightCoordinates) {
  return {
    lineNumber: highlightCoordinates.lineNumber,
    content: ''
    + repeat(highlightCoordinates.columnNumber, ' ')
    + repeat(highlightCoordinates.underlineSize, '^')
  }
}


function calcHighlightCoordinates(path) {
  return {

    /* +2 is for:
    1. quote-prefix on key
    2. dollar-prefix on function*/
    columnNumber: (path.length * INDENT_SIZE) + 2,

    /* Although achievable elsewhere (later) this +1 clearly emphasizes that
    this underline appears AFTER the target line. */
    lineNumber: path.length + 1,

    /* -1 because we do not want to count the dollar-prefix in the underline
    size. Think about it: The problem is what is what comes after the $, not
    the $ itself. Note this is not perfect; maybe the user was trying to
    access a schema key literally prefixed with $. But, in most cases, we
    expect this to NOT be the case. */
    underlineSize: path[path.length - 1].length - 1
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
