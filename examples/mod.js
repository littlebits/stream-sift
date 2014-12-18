var data = require('data.json')
var streamSift = require('../lib')


/*
  Modulus
*/

var spec = { input : { $mod : 1 } } // true when no remainder
var ss = streamSift(spec)

data.map(function(obj){
  console.log(spec, obj, ss(obj))
})
