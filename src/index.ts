import { AcquireRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './utils/url'

function acquire(config: AcquireRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AcquireRequestConfig): void {
  config.url = transformURL(config)
}

function transformURL(config: AcquireRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export default acquire
