export interface bilistNode<T> {
  key: string
  value: T
  pre: bilistNode<T> | null
  next: bilistNode<T> | null
}
export class bilinkedList<T> {
  private head: bilistNode<T>
  private tail: bilistNode<T>
  private size: number
  private hash: Map<string, bilistNode<T>>
  constructor() {
    this.head = { key: '-1', value: {} as T, pre: null, next: null }
    this.tail = { key: '-1', value: {} as T, pre: null, next: null }
    this.head.next = this.tail
    this.tail.pre = this.head
    this.size = 0
    this.hash = new Map()
  }
  _constructNode(key: string, value: any): bilistNode<T> {
    return { key, value, pre: null, next: null }
  }
  _addrecord(node: bilistNode<T>) {
    this.hash.set(node.key, node)
    this.size++
  }
  _removerecord(node: bilistNode<T>) {
    this.hash.delete(node.key)
    this.size--
  }
  unshift(key: string, value: any) {
    let node = this._constructNode(key, value)
    node.pre = this.head
    node.next = this.head.next
    this.head.next!.pre = node
    this.head.next = node
    this._addrecord(node)
  }
  shift(): bilistNode<T> | null {
    if (this.size > 0) {
      let res = this.head.next!
      this.head.next = this.head.next!.next
      this.head.next!.pre = this.head
      res.next = res.pre = null
      this._removerecord(res)
      return res
    }
    return null
  }
  push(key: string, value: any) {
    let node = this._constructNode(key, value)
    node.next = this.tail
    node.pre = this.tail.pre
    this.tail.pre!.next = node
    this.tail.pre = node
    this._addrecord(node)
  }
  pop(): bilistNode<T> | null {
    if (this.size > 0) {
      let res = this.tail.pre!
      this.tail.pre = this.tail.pre!.pre
      this.tail.pre!.next = this.tail
      res.next = res.pre = null
      this._removerecord(res)
      return res
    }
    return null
  }
  has(key: string) {
    return this.hash.has(key)
  }
  get(key: string) {
    return this.hash.get(key)
  }
  delete(key: string) {
    if (this.has(key)) {
      let node = this.get(key)!
      let pre = node.pre,
        next = node.next
      pre!.next = next
      next!.pre = pre
      this._removerecord(node)
    }
  }
  forEach(callback: (node: bilistNode<T>, index: number) => void) {
    if (this.size > 0) {
      let p = this.head.next!
      for (let i = 0; p !== this.tail; i++, p = p.next!) {
        callback(p, i)
      }
    }
  }
}
