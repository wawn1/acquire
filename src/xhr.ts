import { AcquireRequestConfig, AcquireResponse, AcquireResponsePromise } from './types'

export default function xhr(config: AcquireRequestConfig): AcquireResponsePromise {
  return new Promise(resolve => {
    const { url, method = 'get', data = null, headers, responseType } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)
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
        resolve(response)
      }
    }
    request.send(data)
  })
}
