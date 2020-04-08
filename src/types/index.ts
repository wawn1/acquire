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
interface AcquireRequestConfigNoURL {
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}
export interface AcquireRequestConfig extends AcquireRequestConfigNoURL {
  url: string
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

export interface Acquire extends AcquireFns {
  <T = any>(config: AcquireRequestConfig): AcquireResponsePromise<T>
  <T = any>(url: string, config?: AcquireRequestConfigNoURL): AcquireResponsePromise<T>
}
