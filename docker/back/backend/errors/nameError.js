const { StatusCodes } = require('http-status-codes')
class nameError extends Error{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN
      }
}
module.exports = nameError;