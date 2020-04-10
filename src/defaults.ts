import { AcquireRequestConfig } from './types'
import { defaultTransformRequest, defaultTransformResponse } from './core/request'

const defaults: AcquireRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [defaultTransformRequest],
  transformResponse: [defaultTransformResponse],
  csrfCookieName: 'CSRF-TOKEN',
  csrfHeaderName: 'CSRF-TOKEN-HEADER',
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
export default defaults
