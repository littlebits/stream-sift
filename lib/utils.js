
exports.last = function last(x) {
  return x[x.length - 1]
}

exports.repeat = function repeat(times, thing) {
  var count = 0
  var string = ''
  while (count < times) {
    string += thing
    count++
  }
  return string
}

exports.par = function par() {
  var args = Array.prototype.slice.apply(arguments)
  var f = args[0]
  var rest = args.slice(1)
  return f.bind.apply(f, [null].concat(rest))
}

exports.apply = function apply(f, args) {
  return f.apply(null, args)
}

exports.invokeWith = function invokeWith(x, f) {
  return f(x)
}

exports.alias = function alias(object, from, to) {
  object[to] = object[from]
  return object
}

exports.and = function and(a, b) {
  return a && b
}

exports.or = function or(a, b) {
  return a || b
}

exports.compose = function compose(a, b) {
  return function(x) {
    return a(b(x))
  }
}

exports.not = function not(a) {
  return !a
}

exports.equal = function equal(a, b) {
  return a === b
}
