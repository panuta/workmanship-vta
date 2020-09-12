// eslint-disable-next-line max-classes-per-file
export class HttpError extends Error {
  constructor(errorCode, message, httpStatus = 500, meta = {}) {
    super()
    this._errorCode = errorCode
    this.message = message
    this.meta = meta
    this._httpStatus = httpStatus
  }

  get errorCode() {
    return this._errorCode
  }

  get httpStatus() {
    return this._httpStatus
  }
}

export class InternalServerError extends HttpError {
  constructor(err) {
    super('INTERNAL_ERROR', err.message, 500, {
      stacktrace: err.stack
    })
  }
}

export class NotFoundError extends HttpError {
  constructor(message, meta = {}) {
    super('NOT_FOUND', message, 404, meta)
  }
}

export class MissingAttributesError extends HttpError {
  constructor(message, meta = {}) {
    super('MISSING_ATTRIBUTES', message, 400, meta)
  }
}

export class InvalidRequestError extends HttpError {
  constructor(message, meta = {}) {
    super('INVALID_REQUEST', message, 400, meta)
  }
}
