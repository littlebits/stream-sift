var debug = require('debug')('stream-sift:core:lexical-analysis')
var lo = require('lodash')

var forEach = lo.forEach,
    isPlainObject = lo.isPlainObject


/* Tokenize transforms a pattern specification
into a specialized tree structure. It is probably
correct to think of this as taking a program the user
wrote and transforming it into an AST (Abstrct
Syntax Tree).

The tree is of course represented by a JavaScript Object;
It is the schema that is special, tailored for further
parsing. */

module.exports = function tokenize(pattern) {
  debug('started: %j', pattern)
  var tree = newNode(null)
  doTokenize(tree, pattern)
  debug('completed: %j', tree)
  return tree
}



/* Private */

function doTokenize(node, pattern) {
  debug('%j < %j', pattern, node)
  forEach(pattern, function(v, k) {
    if (k[0] === '$') nodeAddCondition(node, condition(k, v))
    else if (isMatchAll(v)) nodeAddCondition(newLeafNode(node, k), conditionPropExists(v))
    else if (isPrimitive(v)) nodeAddCondition(newLeafNode(node, k), conditionLiteral(v))
    else if (isPlainObject(v)) doTokenize(newLeafNode(node, k), v)
  })
}

function newLeafNode(parent, name) {
  return nodeAddLeaf(parent, newNode(name))
}

function nodeAddLeaf(parent, leaf) {
  parent.leafs.push(leaf)
  return leaf
}

function conditionPropExists(/* value */) {
  return condition('$constant', true)
}

function conditionLiteral(value) {
  return condition('$eq', value)
}

function newNode(name) {
  return { name: name, conditions: [], leafs: [] }
}

function nodeAddCondition(node, condition) {
  debug('+condition: %j', condition)
  node.conditions.push(condition)
}

function condition(fname, fargs) {
  return { name: fname, config: (isPrimitive(fargs) ? { value: fargs } : fargs) }
}

function isPrimitive(a) {
  return lo.isNumber(a) || lo.isString(a) || lo.isBoolean(a)
}

function isMatchAll(x) {
  return x === '*'
}
