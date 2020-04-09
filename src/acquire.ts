import {
  Acquire,
  AcquireResponsePromise,
  AcquireRequestConfig,
  AcquireRequestConfigNoURL,
  AcquireResponse,
  ResolvedFn,
  RejectedFn,
  AcquireFns
} from './types'
import easyRequest from './core/easy-request'
import request from './core/request'
import { extend } from './utils/utils'
import { InterceptorManager } from './core/interceptor-manager'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

interface PromiseChain<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
// 1. 将interceptors 放到acquire 函数对象上
// 2. acquire函数执行时，用到interceptors做执行前后拦截
// 如何无侵入修改？
const wrapInterceptors = function(acquire: (url: any, config?: any) => any) {
  const interceptors = {
    request: new InterceptorManager<AcquireRequestConfig>(),
    response: new InterceptorManager<AcquireResponse>()
  }
  function InterceptedAcquire(url: any, config?: any): AcquireResponsePromise {
    config = acquire(url, config)
    const chain: PromiseChain<any>[] = [
      {
        resolved: request,
        rejected: undefined
      }
    ]
    interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }
  InterceptedAcquire.interceptors = interceptors
  extend(InterceptedAcquire, acquire)
  return InterceptedAcquire
}

/**
 * 重载acquire的输入，可以支持(url, config) 和 (config)
 *
 * @param {*} url 第一个参数
 * @param {*} [config] 第二个参数
 * @returns {AcquireResponsePromise}
 */
function overloadInput(url: any, config?: any): any {
  if (typeof url === 'string') {
    if (!config) config = {}
    config.url = url
  } else {
    config = url
  }
  return config
}
function wrapDefaultConfig(
  acquire: (url: any, config?: any) => any,
  defaults: AcquireRequestConfigNoURL
) {
  function AcquireWithDefaults(url: any, config?: any): any {
    config = acquire(url, config)
    return mergeConfig(defaults, config)
  }
  AcquireWithDefaults.defaults = defaults
  extend(AcquireWithDefaults, acquire)
  return AcquireWithDefaults
}
/**
 * acquire是一个函数，可以传入config对象发送请求
 * acquire也是一个对象，对象身上有 get post delete put等快捷方法
 *
 * acquire对象身上还有interceptors可以添加缓存interceptor
 *
 * @returns {AcquireConstructor}
 */
function createInstance(defaults: AcquireRequestConfigNoURL): Acquire {
  // 定义输入函数,重载的
  let acquire = overloadInput
  // 添加合并默认配置处理流程同时添加defaults对象属性
  acquire = wrapDefaultConfig(acquire, defaults)
  // 添加拦截器处理流程同时添加interceptors对象属性
  acquire = wrapInterceptors(acquire)
  // 添加get post 快捷方法
  const easyRequestFuncs: AcquireFns = new easyRequest()
  acquire = extend(acquire, easyRequestFuncs)

  return acquire as Acquire
}

const acquire = createInstance(defaults)

acquire.create = config => {
  return createInstance(mergeConfig(defaults, config))
}

export default acquire
