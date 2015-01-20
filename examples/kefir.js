var streamSift = require('../lib')
var Kefir = require('Kefir')
var colors = require('colors/safe')
var data = require('./data/stream-data.json')


/**
* @desc Creates a Kefir stream with given values Ends when values are delivered.
* @param integer ms: interval in milliseconds.
* @param array data: array of values as JSON objects
*/
var stream = Kefir.sequentially(500, data)

var spec = { "percent" : { $gte : 50 } }  //set schema for stream sift to match
//console.log("Let's find all the values of 'percent' greater then equal to 50: ")


/**
* @desc Stream Sift object
* @param object spec
*/
var ss = streamSift(spec)

/**
* @desc Apply observable to the stream and output data and predicate to stdout
*/

stream.onValue(function(x){
  console.log(colors.green("data:        "), x)
  console.log(colors.green("spec:       "), spec)
  console.log(colors.green("predicate:        "), ss(x))
  console.log()
})
