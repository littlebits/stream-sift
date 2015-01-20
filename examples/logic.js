var streamSift = require('../lib')


var spec = { input : [ { $or : 1 },  { input : 1} ] }
var data = { input : 1, input : 0 }
var ss = streamSift(spec)

//console.log(spec, obj, ss(data))
