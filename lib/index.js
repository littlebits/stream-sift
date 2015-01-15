/* Create a compiler undled with our standard library.
The "compiler" and "library" are strictly separate. In the future
we can imagine that each live in their own projects, allowing
people to create their own standard libraries. */

module.exports = require('./compiler')({
  library: require('./standard-library')
})
