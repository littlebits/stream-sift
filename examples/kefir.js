var streamSift = require('../lib')
var Kefir = require('./utils.js')
var data = require('./data/stream-data.json')

//stream emitters


var stream = Kefir.sequentially(1000, data)
//var spec = { "input" : { $and [ { $eq : 1 }, { $lte: 5 } ] } }
var spec = { "input" : { $eq : 5 } }
var ss = streamSift(spec)

//apply observable
stream.onValue(function(x){
  console.log(x)
  console.log( ss(x) )
})
