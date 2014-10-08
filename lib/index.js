var compile = require('./compiler')
var tester = require('./tester')

module.exports = littleMatch



function littleMatch(pattern){
  return tester(compile(pattern))
}
