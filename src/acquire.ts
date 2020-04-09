import { Acquire, AcquireRequestConfig, AcquireFns, AcquireResponse } from './types'
import easyRequest from './core/easy-request'
import { extend } from './utils/utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'
import WrapRequest from './core/wrap-request'
import { InterceptorManager } from './core/interceptor-manager'

function createInstance(defaults: AcquireRequestConfig): Acquire {
  const interceptors = {
    request: new InterceptorManager<AcquireRequestConfig>(),
    response: new InterceptorManager<AcquireResponse>()
  }

  const wrapper = new WrapRequest(interceptors, defaults)
  let acquire = wrapper.overloadRequest.bind(wrapper)
  const request = wrapper.wrapRequest.bind(wrapper)
  // 添加get post 快捷方法
  const easyRequestFuncs: AcquireFns = new easyRequest(request)
  acquire = extend(acquire, easyRequestFuncs)
  ;(acquire as Acquire).interceptors = interceptors
  ;(acquire as Acquire).defaults = defaults
  return acquire as Acquire
}

const acquire = createInstance(defaults)

acquire.create = config => {
  return createInstance(mergeConfig(defaults, config))
}

acquire.CancelToken = CancelToken
acquire.Cancel = Cancel
acquire.isCancel = isCancel

export default acquire
