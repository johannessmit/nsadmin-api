'use strict'
class ForbiddenError extends Error {
    constructor (message) {
        super(message || 'Forbidden')

        this.name = this.constructor.name
        this.status = 403
    }
}

module.exports = ForbiddenError
