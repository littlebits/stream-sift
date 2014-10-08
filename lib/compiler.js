var debug = require('debug')('matcher-core:compile')
var lo = require('lodash')
// Aliases
var forEach = lo.forEach,
    isPlainObject = lo.isPlainObject,
    map = lo.map



module.exports = compile

function compile(matchSpec){
  debug('start given matchSpec: %j', matchSpec)
  var tree = newNode(null)
  compileNode(tree, matchSpec)
  debug('complete: %j', tree)
  return tree
}


function compileNode(node, subMatchSpec){
  debug('From node: %j branch: (%j)', node, subMatchSpec)
  forEach(subMatchSpec, function(v,k){
    if (k[0] === '$') nodeAddCondition(node, k, v)
    else if (isPrimitive(v)) nodeAddCondition(node, conditionLiteral(v))
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

function nodeAddCondition(node, fname, fargs){
  debug('+condition using function: %j configured with: %j', fname, fargs)
  node.conditions.push(condition(fname, fargs))
}

function condition(fname, fargs){
  switch (fname) {
    case '$or':
      return { name:fname, config: map(fargs, function(v){ return compile(v) }) }
    default:
      return { name:fname, config: (isPrimitive(fargs) ? { value: fargs } : fargs) }
  }
}

function isPrimitive(a){
  return lo.isNumber(a) || lo.isString(a) || lo.isBoolean(a)
}
