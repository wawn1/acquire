import { Method, AcquireResponsePromise, AcquireRequestConfig } from '../types'
import dispatchRequest from './request'

export default class easyRequest {
  request(config: AcquireRequestConfig): AcquireResponsePromise {
    return dispatchRequest(config)
  }
  get(url: string, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithoutData('options', url, config)
  }
  post(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise {
    return this._requestMethodWithData('patch', url, data, config)
  }
  _requestMethodWithoutData(method: Method, url: string, config?: AcquireRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }
  _requestMethodWithData(method: Method, url: string, data?: any, config?: AcquireRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}
