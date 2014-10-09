var debug = require('debug')('matcher-core:$FN')



module.exports = $FN

function $FN($fnInit){
  return function $FNInit(path, config, core){
    debug('Create $fn instance applying to path: %j with config: %j', path, config)
    var $fn = $fnInit(config, core)
    return function $FNTest(obj){
      debug('Exec $fn at path %j with config %j against data: %j', path, config, obj)
      return $fn(seek(path, obj))
    }
  }
}

function seek(path, object){
  return path.reduce(function(obj, key){
    return obj[key]
  }, object)
}
