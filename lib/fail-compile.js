var prepareErrorReport = require('./prepare-error-report')



module.exports = function failCompile(pattern, error) {

  /* Replace the basic error message with a full report of the problem.
  Especially interesting: this is where we tie the error to its context visually
  showing the user exactly where the mistake is within his spec. */
  error = prepareErrorReport(pattern, error)

  /* TODO Not sure if this is a good idea, but the idea here is that
  we probably do not need the stack trace because this error is a parse
  issue that needs to be identified relative to the spec and nother else.
  This may turn out to be a terrible idea for xyz reasons. TBD. The rational
  is to provide a clearest possible message in logs. */
  // Error.prepareStackTrace = function() {}
  throw error
}
