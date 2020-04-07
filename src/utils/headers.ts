import { isPlainObject } from './utils'

function normalizeHeaderName(headers: any, normalizdName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizdName && name.toUpperCase() === normalizdName.toUpperCase()) {
      headers[normalizdName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 给有data数据但是没有设置content-type为json，设置一个header
 *
 * @export
 * @param {*} headers
 * @param {*} data
 * @returns {*}
 */
export function processHeaders(headers: any = {}, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
