import { AcquireRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './utils/url'
import { transformRequest } from './utils/data'
import { processHeaders } from './utils/headers'

function acquire(config: AcquireRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AcquireRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AcquireRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequestData(config: AcquireRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AcquireRequestConfig): any {
  const { headers, data } = config
  return processHeaders(headers, data)
}

export default acquire
