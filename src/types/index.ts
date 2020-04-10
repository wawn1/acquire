export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'patch'
  | 'PATCH'
export interface AcquireRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AcquireTransformer | AcquireTransformer[]
  transformResponse?: AcquireTransformer | AcquireTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  csrfCookieName?: string
  csrfHeaderName?: string

  [propName: string]: any
}

/**
 * data响应数据 status响应状态码 status状态码描述 headers 响应头
 * config 请求配置对象, request 发送请求的XMLHttpRequest对象
 * @export
 * @interface AcquireResponse
 */
export interface AcquireResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AcquireRequestConfig
  request: any
}

export interface AcquireResponsePromise<T = any> extends Promise<AcquireResponse<T>> {}

export interface AcquireError extends Error {
  isAcquireError: boolean
  config: AcquireRequestConfig
  code?: string | null
  request?: any
  response?: AcquireResponse
}

export interface AcquireFns {
  request<T = any>(config: AcquireRequestConfig): AcquireResponsePromise<T>
  get<T = any>(url: string, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  delete<T = any>(url: string, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  head<T = any>(url: string, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  options<T = any>(url: string, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  post<T = any>(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  put<T = any>(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  patch<T = any>(url: string, data?: any, config?: AcquireRequestConfig): AcquireResponsePromise<T>
}

export interface AcquireInterceptors {
  request: AcquireInterceptorManager<AcquireRequestConfig>
  response: AcquireInterceptorManager<AcquireResponse>
}

export interface Request {
  <T = any>(config: AcquireRequestConfig): AcquireResponsePromise<T>
}

export interface Acquire extends AcquireFns {
  <T = any>(config: AcquireRequestConfig): AcquireResponsePromise<T>
  <T = any>(url: string, config?: AcquireRequestConfig): AcquireResponsePromise<T>
  interceptors: AcquireInterceptors
  defaults: AcquireRequestConfig
  create: (config: AcquireRequestConfig) => Acquire
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
export interface AcquireInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): string

  eject(name: string): void

  forEach(callback: (interceptor: Interceptor<T>) => void): void
}

export interface AcquireTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}
