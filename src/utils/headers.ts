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
export function processRequestHeaders(headers: any = {}, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * request.getAllResponseHeaders 返回的字符串转化为对象
 * 字符串一行是一个key:value  \r\n是换行符
 *
 * @export
 * @param {string} headers
 * @returns {*}
 */
export function parseResponseHeaders(headers: string): any {
  let res = Object.create(null)
  if (!headers) return res
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (key && val) {
      res[key] = val.trim()
    }
  })
  return res
}
