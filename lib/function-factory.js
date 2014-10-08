module.exports = $FN



function $FN($fnInit){
  return function $FNInit(path, config){
    var $fn = $fnInit(config)
    return function $FNTest(obj){
      return $fn(seek(path, obj))
    }
  }
}

function seek(path, object){
  return path.reduce(function(obj, key){
    return obj[key]
  }, object)
}
