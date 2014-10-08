var debug = require('debug')('matcher-core:$FN')



module.exports = $FN

function $FN($fnInit){
  debug('Register new $fn:', $fnInit)
  return function $FNInit(path, config, core){
    debug('Create $fn instance applying to path: %j with config: %j', path, config)
    var $fn = $fnInit(config, core)
    return function $FNTest(obj){
      debug('Exec $fn with config %j against data: %j', config, obj)
      return $fn(seek(path, obj))
    }
  }
}

function seek(path, object){
  return path.reduce(function(obj, key){
    return obj[key]
  }, object)
}
