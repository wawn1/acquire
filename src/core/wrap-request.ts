import {
  AcquireInterceptors,
  AcquireRequestConfig,
  ResolvedFn,
  RejectedFn,
  AcquireResponsePromise
} from '../types'
import request from './request'
import mergeConfig from './mergeConfig'

interface PromiseChain<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

class WrapRequest {
  interceptors: AcquireInterceptors
  defaults: AcquireRequestConfig
  constructor(interceptors: AcquireInterceptors, defaults: AcquireRequestConfig) {
    this.interceptors = interceptors
    this.defaults = defaults
  }
  /**
   * 重载acquire的输入，可以支持(url, config) 和 (config)
   *
   * @param {*} url 第一个参数
   * @param {*} [config] 第二个参数
   * @returns {AcquireResponsePromise}
   */
  overloadRequest(url: any, config?: any): any {
    if (typeof url === 'string') {
      if (!config) config = {}
      config.url = url
    } else {
      config = url
    }
    return this.wrapRequest(config)
  }
  /**
   * 在request前后执行拦截器,将默认配置和传入配置合并
   *
   * @param {AcquireRequestConfig} config
   * @returns {AcquireResponsePromise}
   * @memberof WrapRequest
   */
  wrapRequest(config: AcquireRequestConfig): AcquireResponsePromise {
    config = mergeConfig(this.defaults, config)
    const chain: PromiseChain<any>[] = [
      {
        resolved: request,
        rejected: undefined
      }
    ]
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise as AcquireResponsePromise
  }
}

export default WrapRequest
