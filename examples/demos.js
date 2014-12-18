var data = require('./data.json')
var Kefir = require('kefir')
var streamSift = require('../lib')



var spec  = { input : { $eq : 1 } } // $eq
var ss  = streamSift(spec) //set the specification of the pattern


data.map(function(obj){
  console.log(spec, obj, ss(obj)) //get the predicate of the the pattern
})

var spec = { input : { $neq : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})


// $gt

var spec = { input : { $gt : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

// $gte

var spec = { input : { $gte : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

// $lt

var spec = { input : { $lt : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

// $lte

var spec = { input : { $lte : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

// $mod

var spec = { input : { $mod : 1 } } // true when no remainder
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

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

/*
var spec = { input : { $or : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $nor : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $xor : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $and : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

var spec = { input : { $nand : 1 }}
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})
*/
