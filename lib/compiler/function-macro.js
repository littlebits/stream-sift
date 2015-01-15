/* TODO The function macro is weird, bloated, confusing. It should be tamed and
diciplined into a more succint and principaled architecture Things it does:

1.  It generally provides debug introspection
... (see additional comments inline below)
*/

var debug = require('debug')('stream-sift:function-macro')



module.exports = function functionMacro(functionFactory) {

  /* 2. It returns a factory which accepts certain info as a result of th
        parser (the path specified, the function configuration specified),
        which it passes to the library function factory in turn, which
        returns a function ready to execute on data. */
  return function applyFunctionFactory(path, config, compile) {
    debug('Create $fn instance applying to path: %j with config: %j', path, config)
    var $fn = functionFactory(config, compile)

    /* 3. Safely applies the constructed function by first reading the value
          from the data data and then, if something is read, passing that to
          said function. */
    return function apply$fn(obj) {
      var result = seek(path, obj)
      if (result.isFound) debug('Exec $fn: %j against %j in: %j', config, path, obj)
      if (!result.isFound) debug('Skip $fn: %j not found in %j', path, obj)
      return result.isFound ? $fn(result.value) : false
    }
  }
}



/* Private */

function seek(path, object) {
  return path.reduce(function(obj, key) {
    if (!obj.isFound) return obj
    if (obj.value.hasOwnProperty(key)) {
      obj.value = obj.value[key]
    } else {
      obj.isFound = false
    }
    return obj
  }, { isFound: true, value: object })
}
