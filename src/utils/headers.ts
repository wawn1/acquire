import { isPlainObject, deepMerge } from './utils'
import { Method } from '../types'

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

/**
 * 将对象形式的headers转化为一层对象
 * 去掉除了当前使用method的其他请求方法的header
 * headers 包含common, 请求method, 自定义比如msg:1
 * 要将common和method里的内容放到外层
 *
 * @export
 * @param {*} headers
 * @param {Method} method
 * @returns {*}
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => delete headers[method])
  return headers
}
