var lo = require('lodash')
// Aliases
var forEach = lo.forEach,
    isPlainObject = lo.isPlainObject



module.exports = compile

function compile(matchSpec){
  var tree = rootNode()
  compileSub(tree, matchSpec)
  return tree
}


function compileSub(node, subMatchSpec){
  console.log('From node (%j) compile branch (%j)', node, subMatchSpec)
  forEach(subMatchSpec, function(v,k){
    if (k[0] === '$') {
      if (node.isRoot) throw new Error('Root functions not allowed.')
      nodeAddCondition(node, k, v)
    }
    else if (isPrimitive(v)) nodeAddCondition(node, conditionLiteral(v))
    else if (isPlainObject(v)) compileSub(newLeafNode(node, k), v)
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

function condition(fname, fargs){
  return { name:fname, config: (isPrimitive(fargs) ? { value: fargs } : fargs) }
}

function rootNode(){
  return { isRoot:true, leafs:[] }
}

function newNode(name){
  return { name:name, conditions:[], leafs:[] }
}

function nodeAddCondition(node, fname, fargs){
  node.conditions.push(condition(fname, fargs))
}

function isPrimitive(a){
  return lo.isNumber(a) || lo.isString(a) || lo.isBoolean(a)
}
