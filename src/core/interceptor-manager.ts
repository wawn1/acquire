import { ResolvedFn, RejectedFn } from '../types'
import { randomStr } from '../utils/utils'
import { bilinkedList } from '../utils/bilinkedList'
import { Interceptor } from '../types'

export class InterceptorManager<T> {
  private interceptors: bilinkedList<Interceptor<T>>

  constructor() {
    this.interceptors = new bilinkedList()
  }
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): string {
    let interceptor = { resolved, rejected }
    let name = randomStr(10)
    this.interceptors.push(name, interceptor)
    return name
  }
  eject(name: string): void {
    if (this.interceptors.has(name)) {
      this.interceptors.delete(name)
    }
  }
  forEach(callback: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      callback(interceptor.value)
    })
  }
}
