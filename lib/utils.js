var lo = require('lodash')



lo.mixin({
  fnAll: lo.curry(function fnAll(fns, data) {
    for (var i = 0; i < fns.length; i++)
      if (!fns[i](data)) return false
    return true
  }),
  fnAny: lo.curry(function fnAny(fns, data){
    for (var i = 0; i < fns.length; i++) {
      if (fns[i](data)) return true
    }
    return false
  }),
  fnNor: lo.curry(function fnAny(fns, data){
    for (var i = 0; i < fns.length; i++) {
      if (fns[i](data)) return false
    }
    return true
  }),
  hashMap: lo.curry(function hashMap(f, h1) {
    var h2 = {}
    for (var k in h1) if (h1.hasOwnProperty(k)) h2[k] = f(h1[k])
    return h2
  }),
  mutateMergeInto: lo.curry(function mutateMergeInto(target, other) {
    for (var k in other) if (other.hasOwnProperty(k)) target[k] = other[k]
    return target
  })
})



module.exports = lo
