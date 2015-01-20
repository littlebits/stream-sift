var data = require('./data/data.json')
var streamSift = require('../lib')
var c = require('colors/safe')

/**
* $cross
* $crossOrEqual
*/

var spec = { input : { $c : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$cross", spec, obj, ss(obj))
})

var spec = { input : { $ce : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$crossOrEqual", spec, obj, ss(obj))
})

/**
* $crossGreaterThan
* $crossGreaterThanOrEqual
* $crossLessThan
* $crossLessThanOrEqual
*/

var spec = { input : { $cgt : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$crossGreaterThan",spec, obj, ss(obj))
})

var spec = { input : { $cgte : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$crossGreaterThanOrEqual", spec, obj, ss(obj))
})

var spec = { input : { $clt : 2 }}
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$crossLessThan", spec, obj, ss(obj))
})

var spec = { input : { $clte : 2 }}
var ss = streamSift(spec)

data.map(function(obj){
  stdout("$crossLessThanOrEqual", spec, obj, ss(obj))
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
