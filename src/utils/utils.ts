const typeStr = Object.prototype.toString

export function isDate(val: any): val is Date {
  return typeStr.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val != null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return typeStr.call(val) === '[object Object]'
}

/**
 * 将from的原型的方法和自身的属性和方法，放入to
 * for in 会遍历原型
 *
 * @export
 * @template T
 * @template U
 * @param {T} to
 * @param {U} from
 * @returns {(T & U)}
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export const randomStr = (function random() {
  let hash = new Set()
  return function help(length: number) {
    let charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < length; i++) {
      res += charset[~~(Math.random() * charset.length)]
    }
    if (hash.has(res)) help(length)
    hash.add(res)
    return res
  }
})()

/**
 * 传入多个对象，合并生成一个新对象
 * 传入一个对象，复制生成一个内容相同的新对象
 * 合并多个对象时，如果冲突，后面传入的对象内容留下了
 *
 * @export
 * @param {...any[]} objs
 * @returns {*}
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
