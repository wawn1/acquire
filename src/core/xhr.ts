import { AcquireRequestConfig, AcquireResponse, AcquireResponsePromise } from '../types'
import { createError } from '../utils/error'
import { isSameOrigin } from '../utils/utils'
import cookie from '../utils/cookie'

export default function xhr(config: AcquireRequestConfig): AcquireResponsePromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      csrfCookieName,
      csrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth
    } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)

    base()
    result()
    cancel()
    cors()
    progress()
    authorize()

    request.send(data)
    // 基本的请求头设置和响应类型设置
    function base() {
      if (responseType) {
        request.responseType = responseType
      }
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          return
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }
    // 添加上传,下载进度监控函数
    function progress() {
      if (onDownloadProgress) request.onprogress = onDownloadProgress
      if (onUploadProgress) request.upload.onprogress = onUploadProgress
    }
    // 跨域相关处理
    function cors() {
      // withCredentials cors跨域时携带当前文件所在域名,请求域的cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
      //如果是同域名或者withCredentials为true 将token从cookie读出放到header中
      if (withCredentials || isSameOrigin(url!)) {
        if (csrfCookieName) {
          const token = cookie.read(csrfCookieName)
          if (csrfHeaderName && token) {
            request.setRequestHeader(csrfHeaderName, token)
          }
        }
      }
    }
    // 取消功能
    function cancel() {
      // 可以取消, readyState置为0
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
    // 处理响应数据和结果错误处理
    function result() {
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          const responseHeaders = request.getAllResponseHeaders()
          const responseData = responseType !== 'text' ? request.response : request.responseText
          const response: AcquireResponse = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          }
          handleResponse(response)
        }
      }
      // 网络不通错误
      request.onerror = e => reject(createError('Network Error', config, null, request))
      // 超时错误
      if (timeout) request.timeout = timeout
      request.ontimeout = () =>
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      // 需要处理status的错误  status为0表示网络错误或超时错误或跨域错误等
      function handleResponse(response: AcquireResponse) {
        if (response.status === 0) return
        if (response.status >= 200 && response.status < 400) {
          resolve(response)
        } else {
          reject(
            createError(
              `Request failed with status code ${response.status}, ${response.statusText}`,
              config,
              null,
              request,
              response
            )
          )
        }
      }
    }
    // 如果有auth配置, 添加Authorization头
    function authorize() {
      if (auth) {
        request.setRequestHeader(
          'Authorization',
          `Basic ${btoa(auth.username + ':' + auth.password)}`
        )
      }
    }
  })
}
