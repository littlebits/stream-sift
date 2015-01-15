
/* Export an instantiated core bundled with our standard library.
The "core" and "library" are strictly separate. In the future
we can imagine that each live in their own projects, allowing
people to create their own standard libraries. */

module.exports = require('./core')().addFns(require('./functions'))
