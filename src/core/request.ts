import { AcquireRequestConfig, AcquireResponsePromise, AcquireResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../utils/url'
import { transformRequest, transformResponse } from '../utils/data'
import { processRequestHeaders, parseResponseHeaders } from '../utils/headers'

function request(config: AcquireRequestConfig): AcquireResponsePromise {
  processConfig(config)
  return xhr(config).then(res => {
    res.headers = parseResponseHeaders(res.headers)
    res.data = transformResponse(res.data)
    return res
  })
}

function processConfig(config: AcquireRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformRequestHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AcquireRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AcquireRequestConfig): any {
  return transformRequest(config.data)
}

function transformRequestHeaders(config: AcquireRequestConfig): any {
  const { headers, data } = config
  return processRequestHeaders(headers, data)
}

export default request
