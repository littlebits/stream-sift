var debug = require('debug')('stream-sift:parse')
var debugExec = require('debug')('stream-sift:exec')
var u = require('../utils')
var assert = require('./assert')
var context = require('./standard-library')



var and = u.and,
    equal = u.equal,
    not = u.not,
    par = u.par,
    apply = u.apply,
    invokeWith = u.invokeWith,
    compose = u.compose



module.exports = parse



function parse(ast) {
  debug('Parsing AST %j', ast)
  var pipeline = parseChildNodes(ast)
  debug('Parsed AST into pipeline', pipeline)
  return function(data) {
    debugExec('Executing pattern match against data', data)
    return pipeline
            .map(par(invokeWith, data))
            .reduce(and)
  }
}



function parseChildNodes(node) {
  return node.children.map(parseNode)
}

function parseNode(node) {
  debug('Parsing a %s node of value: %j', node.type, node.value)

  if (node.type === 'target') {

    /* If the node is a target we must return a function that traverses that
    target and passes the value to the children for further processing. */
    var funcs = parseChildNodes(node)
    return function readTarget(targetData) {

      /* If the pattern-key does not exist on the real-data
      then abort with false return. This can happen when the target specified
      by the user does not exist on the actual data flowing through. */
      if (!targetData.hasOwnProperty(node.value)) return false
      debugExec('Traversing target %j in data %j', node.value, targetData)

      /* Pass the target value to each child and reduce the child-results
      into a single boolean. */
      return mapReduceFuncs(funcs, targetData[node.value])
    }
  }

  else if (node.type === 'kwargsFunc') {
    var func = lookupDef(node)
    func = func(node.kwargs)
    return func
  }

  else if (node.type === 'func') {
    var func = lookupDef(node)
    var args = parseChildNodes(node)

    /* If the func arguments are all resolved then construct the func with
    this value. This is useful for stateful functions such as threshold logic.
    It is simply annoying for pure fucntions like greaterThan. It is however
    impossible for cases where function arguments are computed such as in
    condition-branching functions like "and", "or", etc. which can only resolve
    once the final data has been given. */
    var argsResolved = isResolvedArgs(args)
    if (argsResolved) {
      func = func(args.length === 1 ? { value: args[0] } : { value: args })
    } else {
      func = func('COMPUTED_ARGS')
    }

    return function(target) {
      /* Resolve all of this func's children. Any child that is a
      function must be resolved. */
      var resolvedChildren

      if (!argsResolved) {
        resolvedChildren = args.map(function(arg) {
          if (typeof arg === 'function') return arg(target)
          return arg
        }).concat([target])
      } else {
        resolvedChildren = [target]
      }

      debugExec('Evaluating %s %s', node.value, resolvedChildren.join(' '))
      return apply(func, resolvedChildren)
    }
  }

  else if (node.type === 'index') {
    return par(mapReduceTrue, parseChildNodes(node))
  }

  else if (node.type === 'literal') {
    if (node.value === '*') return function() { return true }
    return node.value
  }

  else {
    throw new Error('Unknown node type: ' + node)
  }
}



function lookupDef(node) {
  var f = context[node.type === 'kwargsFunc' ? node.value.slice(1) : node.value]
  assert.funcDefined(f, node)

  return f
}



/* Any child that is a literal number implies a literal match, shorthand for
the more verbose case of applying an $eq. */
function mapReduceFuncs(funcs, targetData) {
  return funcs
  .map(function(func) {
    return typeof func === 'function'
           ? func(targetData)
           : equal(func, targetData)
  })
  .reduce(and)
}

function isResolvedArgs(args) {
  return args
    .map(compose(not, isJSFunction))
    .reduce(and)
}
function isJSFunction(x) {
  return typeof x === 'function'
}



/* Micro Function Utilities */

function mapReduceTrue(fs, data) {
  return fs
    .map(par(invokeWith, data))
    .reduce(and)
}
