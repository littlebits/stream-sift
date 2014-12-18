var data = require('./data.json')
var streamSift = require('../lib')


/*

Relational Matching

A Match is determined by testing the relational expression of a
value provided in a specification.

*/

// Equivalency
// $eq

var spec  = { input : { $eq : 1 } }
var ss  = streamSift(spec)


data.map(function(obj){
  console.log(spec, obj, ss(obj))
})

// $nq

var spec = { input : { $neq : 1 } }
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})


// Greater Than
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

// Less Than
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
