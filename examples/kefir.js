var streamSift = require('../lib')
var Kefir = require('Kefir')
var colors = require('colors/safe')
/**
* This example will create a 'simulated' stream based off of
* sample data from a littleBits api.
*
**/
var data = require('./data/stream-data.json')

/**
* @desc Creates a Kefir stream with given values Ends when values are delivered.
* @param integer ms: interval in milliseconds.
* @param array data: array of values as JSON objects
*/
var stream = Kefir.sequentially(500, data)
var spec = { "percent" : { $gte : 50 } }  //set schema for stream sift to match

/**
* @desc Stream Sift object
* @param object spec
*/
var ss = streamSift(spec)

/**
* @desc Apply observable to the stream and output data and predicate to stdout
*/

stream.onValue(function(x){
  console.log(colors.green("data:        "))
  console.log(x)
  console.log(colors.green("spec:       "), spec)
  console.log(colors.green("predicate:       "), (ss(x) ? colors.green(JSON.stringify(ss(x))) : colors.red(JSON.stringify(ss(x)))))
  console.log()
})
