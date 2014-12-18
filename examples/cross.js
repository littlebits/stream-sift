var data = require('./data.json')
var streamSift = require('../lib')

// $cross and $crossOrEqual

var spec = { input : { $c : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $ce : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})


// $crossGreaterThan / $crossGreaterThanOrEqual / $crossLessThan
// $crossLessThanOrEqual

var spec = { input : { $cgt : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $cgte : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $clt : 2 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $clte : 2 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $not : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})
