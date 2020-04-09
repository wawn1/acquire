import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

/**
 * CancelToken 通过executor向外传出一个函数
 * 该函数可以使promise成功，并且只执行一次
 *
 * 但是使用已经cancel的token发请求,直接抛异常提示代码写错了
 * 需要在请求发送前throwIfRequested 检查这个token是不是已经取消过一次了
 *
 * promise成功就会执行xhr中abort方法,需要这个类实例传入config
 *
 * reason是Cancel类型，xhr 失败后catch的是一个Cancel类型对象
 * 这样可以通过类型判断实现isCancel判断区分reject失败原因
 *
 * @export
 * @class CancelToken
 */
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }
  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
