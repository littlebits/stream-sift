var fns = require('./functions')
var lo = require('lodash')



function tester(pattern){
  var tests = flatten([], [pattern])
  // console.log('tests:', tests)
  return function doTest(data){
      for (var i = 0; i < tests.length; i++)
        if (!tests[i](data)) return false
      return true
  }
}

function flatten(path, pattern){
  // console.log('flatten: From path %j pattern: %j', path, pattern)
  return lo.flatten(pattern
    .map(function(patpart){
      var partpath = (patpart.name ? path.concat([patpart.name]) : path)
      // console.log('flatten: part: %j', patpart)
      return patpart
        .conditions
        .map(function(cond){
          // console.log('flatten: condition: %j', cond)
          return fns[cond.name](partpath, cond.config)
        })
        .concat(
          flatten(partpath, patpart.leafs)
        )
    }))
}

/*
part 2: Applying tests

Create a function that accepts cloudbit data. When data is received...
if there are no conditions for the event type of the data do nothing
otherwise pipeline the data through to the respective event type's conditions
short-circut and do nothing if any test along the pipeline returns false
otherwise if each test in the pipeline returns true then publish that data over
URI or pubsub (depending on the subscriber type)

for example suppose the data was:

{ type: 'input', percent: 90 }

then the test would return true.



part 3: changing subscription specs

if all conditions for an event type are deleted then just delete the same-named
  key from the existing compiled tests object.
if conditions for an event type *that previously has no conditions set* are
  added then compile a new tests object and merge it into the existing compiled
  tests object. Since these are the first conditions for this event type
  conflicts are impossible.
if conditions for an event type change such that:
  1. The event type had conditions applied prior
  2. The event type will still have conditions following the mutation
  then begin by deleting the compiled tests for this event type, then compile
  new tests using the new conditions, then merge the new compiled tests
  object into the existing object.
*/
module.exports = tester
