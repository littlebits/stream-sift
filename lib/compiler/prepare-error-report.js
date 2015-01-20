/* Produce a detailed report suitable for printing to the console. This report
is design for HUMAN consumption. TODO This report builder is currently
hard-coded to exclusively deal with undefinedFunction errors. For instance
the way we render underlines is bias to this case. */

var u = require('../utils')
var symbols = require('./symbols')
var errors = require('./errors')


var last = u.last,
    repeat = u.repeat




module.exports = function prepareErrorReport(pattern, error) {
  /* If this error does not have a code then it is not something we know how to
  report. */
  if (!error.code) return error

  if (error.code === errors.ENOF.code) {
    var patternString = stringifyPattern(pattern)
    var highlightCoordinates = calcHighlightCoordinates(error.location)
    patternString = spliceLine(patternString, highlightLine(highlightCoordinates))
    error.message = 'Error: ' + error.message + '\n\n' + patternString
  }

  return error
}



/* Private */

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
  var matches = key.match(new RegExp('(^\\' + symbols.func + '+)?(.*)'))
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

function stringifyPattern(o) {
  return JSON.stringify(o, null, INDENT_SIZE)
}
