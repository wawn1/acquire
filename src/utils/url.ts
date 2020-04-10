import { isDate, isPlainObject, isURLSearchParams } from './utils'

/**
 * 函数式遍历对象 key value
 *
 * @param {{ [propName: string]: any }} obj  对象
 * @param {(key: string, val: any) => any} callback 回调
 */
function forObj(obj: { [propName: string]: any }, callback: (key: string, val: any) => any) {
  for (let i in obj) {
    callback(i, obj[i])
  }
}

/**
 * 先将map的key放入except中,不要替换
 * 最后才应用map的替换规则
 *
 * except先encode获得编码后的字符,记录下来
 * 还原的时候使用,将except中编码后的字符替换为原字符
 *
 * @param {string} val 被encode的字符串
 * @param {object} map 替换规则, map中的key替换为value, 应用到val
 * @param {...string[]} except 不用encode的字符
 * @returns {string}
 */
function encode(val: string, map: object, ...except: string[]): string {
  forObj(map, key => except.push(key))
  let encodeExcept = except.map(val => encodeURIComponent(val))
  let res = encodeURIComponent(val)
  encodeExcept.forEach((encode: string, index: number) => {
    res = res.replace(new RegExp(encode, 'ig'), except[index])
  })
  forObj(map, (key, val) => {
    res = res.replace(key, val)
  })
  return res
}

/**
 * url 参数的key 和value编码函数
 * 空格替换为+
 * @ : $ , [ ] 不编码
 * @param {string} val
 */
const paramEncode = (val: string) => encode(val, { ' ': '+' }, '@', ':', '$', ',', '[', ']')

/**
 * 1. 如果url包含有 # 锚点要去掉锚点路径
 * 2. 如果url包含部分参数字符串把其他参数&连进去 否则?连进去
 * @param {string} url url字符串 可以包含部分参数字符串 'www.xyz.com?bar=1'
 * @param {string[]} parts  参数序列化好的等式字符串数组  ['foo=1']
 * @returns url 连接好的url
 */
const joinParams = (url: string, paramsStr: string): string => {
  if (paramsStr) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + paramsStr
  }
  return url
}

/**
 * 把params 对象编码成 key=value字符串数组
 * value 为空忽略
 * 有的value是数组 为方便操作 value不是数组 套一个数组
 *
 * value是Date编码为ISOString, 对象编码为JSON字符串
 * key 和value 都要字符转码
 * 连接key=value
 *
 * @param {*} params 参数集合的对象
 * @returns parts encodeKey=encodeValue 字符串数组
 */
const encodePair = (params: any): string[] => {
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${paramEncode(key)}=${paramEncode(val)}`)
    })
  })
  return parts
}

export function defaultParamsSerializer(params: any): string {
  if (isURLSearchParams(params)) return params.toString()
  const parts = encodePair(params)
  return parts.join('&')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  if (!paramsSerializer) paramsSerializer = defaultParamsSerializer
  const serializedParams = paramsSerializer(params)
  return joinParams(url, serializedParams)
}
