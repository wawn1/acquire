import {
  Acquire,
  AcquireResponsePromise,
  AcquireRequestConfig,
  AcquireResponse,
  ResolvedFn,
  RejectedFn,
  AcquireFns
} from './types'
import easyRequest from './core/easy-request'
import request from './core/request'
import { extend } from './utils/utils'
import { InterceptorManager } from './core/interceptor-manager'

interface PromiseChain<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
// 1. 将interceptors 放到acquire 函数对象上
// 2. acquire函数执行时，用到interceptors做执行前后拦截
// 如何无侵入修改？
const wrap = function(fn: (url: any, config?: any) => AcquireRequestConfig) {
  const interceptors = {
    request: new InterceptorManager<AcquireRequestConfig>(),
    response: new InterceptorManager<AcquireResponse>()
  }
  function InterceptedAcquire(url: any, config?: any): AcquireResponsePromise {
    config = fn(url, config)
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
  return InterceptedAcquire
}

/**
 * 重载acquire的输入，可以支持(url, config) 和 (config)
 *
 * @param {*} url 第一个参数
 * @param {*} [config] 第二个参数
 * @returns {AcquireResponsePromise}
 */
function overloadRequest(url: any, config?: any): AcquireRequestConfig {
  if (typeof url === 'string') {
    if (!config) config = {}
    config.url = url
  } else {
    config = url
  }
  return config
}
/**
 * acquire是一个函数，可以传入config对象发送请求
 * acquire也是一个对象，对象身上有 get post delete put等快捷方法
 *
 * acquire对象身上还有interceptors可以添加缓存interceptor
 *
 * @returns {AcquireConstructor}
 */
function createInstance(): Acquire {
  const easyRequestFuncs: AcquireFns = new easyRequest()
  let acquire = overloadRequest

  acquire = extend(acquire, easyRequestFuncs)
  acquire = wrap(acquire)
  return acquire as Acquire
}

const acquire = createInstance()

export default acquire
