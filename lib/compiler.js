var debug = require('debug')('matcher-core:compile')
var lo = require('lodash')
// Aliases
var forEach = lo.forEach,
    isPlainObject = lo.isPlainObject,
    map = lo.map



module.exports = compile

function compile(matchSpec){
  debug('started: %j', matchSpec)
  var tree = newNode(null)
  compileNode(tree, matchSpec)
  debug('completed: %j', tree)
  return tree
}


function compileNode(node, subMatchSpec){
  debug('%j < %j', subMatchSpec, node)
  forEach(subMatchSpec, function(v,k){
    if (k[0] === '$') nodeAddCondition(node, condition(k, v))
    else if (isPrimitive(v)) nodeAddCondition(newLeafNode(node, k), conditionLiteral(v))
    else if (isPlainObject(v)) compileNode(newLeafNode(node, k), v)
  })
}
function newLeafNode(parent, name){
  return nodeAddLeaf(parent, newNode(name))
}
function nodeAddLeaf(parent, leaf){
  parent.leafs.push(leaf)
  return leaf
}

function conditionLiteral(value){
  return condition('$eq', value)
}

function newNode(name){
  return { name:name, conditions:[], leafs:[] }
}

function nodeAddCondition(node, condition){
  debug('+condition: %j', condition)
  node.conditions.push(condition)
}

function condition(fname, fargs){
  return { name:fname, config: (isPrimitive(fargs) ? { value: fargs } : fargs) }
}

function isPrimitive(a){
  return lo.isNumber(a) || lo.isString(a) || lo.isBoolean(a)
}
