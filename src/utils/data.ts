import { isPlainObject } from './utils'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 如果没有设置resposeType是json XMLHttpRequest不会将字符串转对象
 * 但是有必要尝试解析, 能解析就解析
 *
 * @export
 * @param {*} data 响应数据
 * @returns {*}
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
