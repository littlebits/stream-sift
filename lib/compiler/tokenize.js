var u = require('../utils')
var symbols = require('./symbols')
var errors = require('./error')



var par = u.par,
    equal = u.equal

/* constants for node types. */

var TYPES = {
  root: 'root',
  func: 'func',
  kwargsFunc: 'kwargsFunc',
  target: 'target',
  literal: 'literal',
  index: 'index'
}



module.exports = tokenize

function tokenize(pattern) {
  errors.assertPatternType(pattern)
  return tokenizeNodes(pattern, rootNode())
}



function tokenizeNodes(sourceChildren, parent) {

  /* If the sourceChildren are null then this branch is fully tokenized. We
  need only return the so-called parent which in this case is not actually a
  parent, evidently! */
  if (sourceChildren === null)
    return parent

  /* if the sourceChildren *is* actually a single primitive value then we have
  nearly completed tokenizing this branch. We just have to create this final
  node and then immediately return the parent. */
  if (isPrimitive(sourceChildren)) {
    addChild(parent, literalNode(sourceChildren))
    return parent
  }

  else if (Array.isArray(sourceChildren)) {
    sourceChildren.forEach(function(sourceValue, index) {
      tokenizeNodes(sourceValue, addChild(parent, indexNode(index)))
    })
  }

  else {
    for (var sourceIdent in sourceChildren) {
      tokenizeRawNode(parent, sourceIdent, sourceChildren[sourceIdent])
    }
  }

  return parent
}



function tokenizeRawNode(parent, name, sourceChildren) {
  var sourceNodeType = calcSourceNodeType(name, sourceChildren)
  var node = nodeConstructors[sourceNodeType](name)

  /* TODO refactor! kwargsFunc logic!!!!! Huge exception for single node
  type case. */
  if (node.type === 'kwargsFunc') {
    addChild(parent, node)
    node.kwargs = sourceChildren
    return parent
  }

  return tokenizeNodes(sourceChildren, addChild(parent, node))
}






/* Tree manipulation functions */

function addChild(parent, node) {
  parent.children.push(node)
  node.parent = parent
  return node
}






/* Node Constructors. A safe and reliable way to create new nodes. */

var nodeConstructors = {
  kwargsFunc: kwargsFuncNode,
  func:       funcNode,
  target:     targetNode,
  literal:    literalNode
}

function rootNode() {
  return createNode(TYPES.root, null)
}
function indexNode(value) {
  return createNode(TYPES.index, value)
}
function literalNode(value) {
  return createNode(TYPES.literal, value, null)
}
function funcNode(value) {
  return createNode(TYPES.func, value)
}
function kwargsFuncNode(value) {
  return createNode(TYPES.kwargsFunc, value)
}
function targetNode(value) {
  return createNode(TYPES.target, value)
}
function createNode(type, value) {
  return {
    type: type,
    value: value,
    parent: null,
    children: []
  }
}






// TODO Refactor inconsistencies
// - isWildcard not part of top-level type-of function
// - ditto with primitive check

/* Functions for detecting the type of node being tokenized. The argument
name gives a hint of the information needed for the answer (key or value). */

function calcSourceNodeType(name, sourceChildren) {
  return  isKwargsFunc(name)        ? 'kwargsFunc' :
          isFunc(name)              ? 'func'       :
          isLiteral(sourceChildren) ? 'literal'    :
                                      'target'
}

var isWildcard = par(equal, symbols.wildcard)

function isKwargsFunc(key) {
  return key.slice(0, 2) === symbols.kwargsFunc
}

function isFunc(key) {
  return key[0] === symbols.func
}


// TODO something special is happening here, document
function isLiteral(children) {
  return children === null
}

function isPrimitive(value) {
  return typeof value === 'number'
  || typeof value === 'string'
  || typeof value === 'boolean'
}
