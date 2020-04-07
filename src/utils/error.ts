import { AcquireResponse, AcquireRequestConfig } from '../types'

class AcquireError extends Error {
  isAcquireError: boolean
  config: AcquireRequestConfig
  code?: string | null
  request?: any
  response?: AcquireResponse

  constructor(
    message: string,
    config: AcquireRequestConfig,
    code?: string | null,
    request?: any,
    response?: AcquireResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAcquireError = true
    Object.setPrototypeOf(this, AcquireError.prototype)
  }
}

export function createError(
  message: string,
  config: AcquireRequestConfig,
  code?: string | null,
  request?: any,
  response?: AcquireResponse
) {
  const error = new AcquireError(message, config, code, request, response)
  return error
}
