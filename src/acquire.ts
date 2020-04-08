import { Acquire, AcquireResponsePromise } from './types'
import easyRequest from './core/easy-request'
import request from './core/request'
import { extend } from './utils/utils'

/**
 * 重载acquire的输入，可以支持(url, config) 和 (config)
 *
 * @param {*} url 第一个参数
 * @param {*} [config] 第二个参数
 * @returns {AcquireResponsePromise}
 */
function overloadRequest(url: any, config?: any): AcquireResponsePromise {
  if (typeof url === 'string') {
    if (!config) config = {}
    config.url = url
  } else {
    config = url
  }
  return request(config)
}

/**
 * acquire是一个函数，可以传入config对象发送请求
 * acquire也是一个对象，对象身上有 get post delete put等快捷方法
 *
 * @returns {AcquireConstructor}
 */
function createInstance(): Acquire {
  const easyRequestFuncs = new easyRequest()
  const acquire = overloadRequest

  extend(acquire, easyRequestFuncs)
  return acquire as Acquire
}

const acquire = createInstance()

export default acquire
