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
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

/**
 * data响应数据 status响应状态码 status状态码描述 headers 响应头
 * config 请求配置对象, request 发送请求的XMLHttpRequest对象
 * @export
 * @interface AcquireResponse
 */
export interface AcquireResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AcquireRequestConfig
  request: any
}

export interface AcquireResponsePromise extends Promise<AcquireResponse> {}
