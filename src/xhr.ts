import { AcquireRequestConfig } from './types'

export default function xhr(config: AcquireRequestConfig) {
  const { url, method = 'get', data = null, headers } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)
  Object.keys(headers).forEach(name => {
    if (data === null && name.toLowerCase() === 'content-type') {
      return
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
  request.send(data)
}
