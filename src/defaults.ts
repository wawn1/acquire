import { AcquireRequestConfigNoURL } from './types'
import { defaultTransformRequest, defaultTransformResponse } from './core/request'

const defaults: AcquireRequestConfigNoURL = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [defaultTransformRequest],
  transformResponse: [defaultTransformResponse]
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
