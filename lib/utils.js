var lo = require('lodash')



lo.mixin({
  fnAll: function fnAll(fns, data){
    for (var i = 0; i < fns.length; i++)
      if (!fns[i](data)) return false
    return true
  },
  fnAny: function fnAny(fns, data){
    for (var i = 0; i < fns.length; i++) {
      if (fns[i](data)) return true
    }
    return false
  }
})



module.exports = lo
