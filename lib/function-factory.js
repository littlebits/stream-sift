var debug = require('debug')('matcher-core:$FN')



module.exports = $FN

function $FN($fnInit){
  return function $FNInit(path, config, core){
    debug('Create $fn instance applying to path: %j with config: %j', path, config)
    var $fn = $fnInit(config, core)
    return function $FNTest(obj){
      var result = seek(path, obj)
      if (result.isFound) debug('Exec $fn: %j against %j in: %j', config, path, obj)
      if (!result.isFound) debug('Skip $fn: %j not found in %j', path, obj)
      return result.isFound ? $fn(result.value) : false
    }
  }
}

function seek(path, object){
  return path.reduce(function(obj, key){
    if (!obj.isFound) return obj
    if (obj.value.hasOwnProperty(key)) {
      obj.value = obj.value[key]
    } else {
      obj.isFound = false
    }
    return obj
  }, {isFound:true, value:object})
}
