var data = require('./data/data.json')
var streamSift = require('../lib')
var c = require('colors/safe')

/**
* $eq
*/
var spec  = { input : { $eq : 1 } }
var ss  = streamSift(spec)


data.map(function(obj){
  stdout("$eq", spec, obj, ss(obj))
})

/**
* $neq
*/

var spec = { input : { $neq : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$neq", spec, obj, ss(obj))
})


/**
* $gt
*/

var spec = { input : { $gt : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$gt", spec, obj, ss(obj))
})

/**
* $gte
*/

var spec = { input : { $gte : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$gte", spec, obj, ss(obj))
})

/**
* $lt
*/

var spec = { input : { $lt : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$lt", spec, obj, ss(obj))
})

/**
* $lte
*/

var spec = { input : { $lte : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$lte", spec, obj, ss(obj))
})

//ugly console helper
function stdout (fn, spec, obj, predicate){
  var falsey = c.red
  var truthy = c.green
  console.log("function:    ", fn)
  console.log("spec:        ", spec)
  console.log("object:      ", obj)
  console.log("predicate:   ", predicate ? truthy(predicate) : falsey(predicate))
  console.log()
}
