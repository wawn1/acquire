import { AcquireRequestConfig, AcquireResponsePromise, AcquireResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../utils/url'
import { transformRequest, transformResponse } from '../utils/data'
import { processRequestHeaders, parseResponseHeaders, flattenHeaders } from '../utils/headers'
import transform from './transform'

function request(config: AcquireRequestConfig): AcquireResponsePromise {
  processConfig(config)
  return xhr(config).then(res => {
    res.headers = parseResponseHeaders(res.headers)
    res.data = transform(res.data, res.headers, config.transformResponse)
    return res
  })
}

function processConfig(config: AcquireRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AcquireRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export function defaultTransformRequest(data: any, headers?: any): any {
  processRequestHeaders(headers, data)
  return transformRequest(data)
}
export function defaultTransformResponse(data: any, headers?: any): any {
  return transformResponse(data)
}

export default request
