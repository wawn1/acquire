/**
 * cancel 消息对象
 *
 * @export
 * @class Cancel
 */
export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
