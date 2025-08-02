class CustomError extends Error {
  constructor(name, message, statusCode, messageToUser) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error"
    // So the error is neat when stringified. NotFoundError: message instead of Error: message
    this.name = name
    this.messageToUser = messageToUser
    // this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = CustomError
